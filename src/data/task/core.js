//---------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// See LICENCE for licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//---------------------------------------------------------------------

// --[ Dependencies ]--------------------------------------------------
const { data, show } = require('folktale/core/adt');

// --[ Helpers ]-------------------------------------------------------
const defer = (fn) => process.nextTick(fn);

// --[ Implementation ]------------------------------------------------
const ExecutionState = data('folktale:Data.Task.ExecutionState', {
  Pending() {
    return {};
  },

  Cancelled() {
    return {};
  },

  Resolved(value) {
    return { value };
  },

  Rejected(reason) {
    return { reason };
  }
}).derive(show);

const { Pending, Cancelled, Resolved, Rejected } = ExecutionState;


function Task(computation, onCancel, cleanup) {
  this._computation = computation;
  this._onCancel    = onCancel || (_ => null);
  this._cleanup     = cleanup  || (_ => null);
}

Task.prototype.chain = function(transform) {
  return new Task(
    (reject, resolve, cancel) => {
      this.run().listen({
        onCancelled: cancel,
        onRejected:  reject,
        onResolved:  value => {
          transform(value).run().listen({
            onCancelled: cancel,
            onRejected:  reject,
            onResolved:  resolve
          });
        }
      }); 
    }
  );
};

Task.prototype.map = function(transform) {
  return new Task(
    (reject, resolve, cancel) => {
      this.run().listen({
        onCancelled: cancel,
        onRejected:  reject,
        onResolved:  value => resolve(transform(value))
      });
    }
  );
};

Task.prototype.or = function(that) {
  return new Task(
    (reject, resolve, cancel) => {
      let thisExecution = this.run();
      let thatExecution = that.run();
      let done = false;

      const guard = (fn, execution) => (value) => {
        if (!done) {
          done = true;
          execution.cancel();
          fn(value);
        }
      };

      thisExecution.listen({
        onRejected:  guard(reject, thatExecution),
        onCancelled: guard(cancel, thatExecution),
        onResolved:  guard(resolve, thatExecution)
      });

      thatExecution.listen({
        onRejected:  guard(reject, thisExecution),
        onCancelled: guard(cancel, thisExecution),
        onResolved:  guard(resolve, thisExecution)
      });

      return [thisExecution, thatExecution];
    },
    ([thisExecution, thatExecution]) => { 
      thisExecution.cancel(); 
      thatExecution.cancel(); 
    }
  );
};

Task.prototype.and = function(that) {
  return new Task(
    (reject, resolve, cancel) => {
      let thisExecution = this.run();
      let thatExecution = that.run();
      let valueLeft = null;
      let valueRight = null;
      let doneLeft = false;
      let doneRight = false;
      let cancelled = false;

      const guardResolve = (setter) => (value) => {
        if (cancelled)  return;

        setter(value);
        if (doneLeft && doneRight) {
          resolve([valueLeft, valueRight]);
        }
      };

      const guardRejection = (fn, execution) => (value) => {
        if (cancelled)  return;

        cancelled = true;
        execution.cancel();
        fn(value);
      };

      thisExecution.listen({
        onRejected:  guardRejection(reject, thatExecution),
        onCancelled: guardRejection(cancel, thatExecution),
        onResolved:  guardResolve(x => { 
          valueLeft = x; 
          doneLeft = true; 
        })
      });

      thatExecution.listen({
        onRejected:  guardRejection(reject, thisExecution),
        onCancelled: guardRejection(cancel, thisExecution),
        onResolved:  guardResolve(x => { 
          valueRight = x; 
          doneRight = true; 
        })
      });

      return [thisExecution, thatExecution];
    },
    ([thisExecution, thatExecution]) => {
      thisExecution.cancel(); 
      thatExecution.cancel(); 
    }
  );
};

Task.prototype.run = function() {
  let deferred  = new Deferred();
  deferred.listen({
    onCancelled: _ => {
      defer(_ => { this._onCancel(resources); this._cleanup(resources) });
    },

    onResolved: value => {
      defer(_ => { this._cleanup(resources) });
    },

    onRejected: reason => {
      defer(_ => { this._cleanup(resources) });
    }
  });

  const resources = this._computation(
    error => { deferred.reject(error) },
    value => { deferred.resolve(value) },
    _     => { deferred.cancel() }
  );

  return new TaskExecution(this, deferred);
};


function TaskExecution(task, deferred) {
  this._task      = task;
  this._deferred  = deferred;
}

TaskExecution.prototype.cancel = function() {
  this._deferred.cancel();
};

TaskExecution.prototype.listen = function(pattern) {
  this._deferred.listen(pattern);
};

TaskExecution.prototype.promise = function() {
  return this._deferred.promise();
};

TaskExecution.prototype.future = function() {
  return this._deferred.future();
};

function Deferred() {
  this._state     = Pending();
  this._listeners = [];
}

const moveToState = (deferred, newState) => {
  if (!Pending.hasInstance(deferred._state)) {
    const description = newState.matchWith({
      Resolved:  _ => 'resolved',
      Rejected:  _ => 'rejected',
      Cancelled: _ => 'cancelled'
    });
    throw new Error(`Only pending deferreds can be ${description}, this deferred is already ${deferred._state}`);
  }

  deferred._state = newState;

  const listeners = deferred._listeners;
  for (let i = 0; i < listeners.length; ++i) {
    newState.matchWith({
      Resolved: ({ value })  => listeners[i].onResolved(value),
      Rejected: ({ reason }) => listeners[i].onRejected(reason),
      Cancelled: _           => listeners[i].onCancelled()
    });
  }
  deferred._listeners = [];
};

Deferred.prototype.resolve = function(value) {
  moveToState(this, Resolved(value));
};

Deferred.prototype.reject = function(reason) {
  moveToState(this, Rejected(reason));
};

Deferred.prototype.cancel = function() {
  moveToState(this, Cancelled());
};

Deferred.prototype.listen = function(pattern) {
  this._state.matchWith({
    Pending:   _            => this._listeners.push(pattern),
    Cancelled: _            => pattern.onCancelled(), 
    Resolved:  ({ value })  => pattern.onResolved(value),
    Rejected:  ({ reason }) => pattern.onRejected(reason)
  });
};

Deferred.prototype.promise = function() {
  return new Promise((reject, resolve) => {
    this.listen({
      onCancelled: _ => reject(Cancelled()),
      onResolved: resolve,
      onRejected: reject 
    });
  });
};

Deferred.prototype.future = function() {
  let future = new Future();
  this.listen({
    onCancelled: _ => moveToState(future, Cancelled()),
    onRejected:  ({ reason }) => moveToState(future, Rejected(reason)),
    onResolved:  ({ value })  => moveToState(future, Resolved(value)) 
  });

  return future;
};


function Future() {
  this._state     = Pending();
  this._listeners = [];
}

Future.prototype.listen = function(pattern) {
  this._state.matchWith({
    Pending:   _            => this._listeners.push(pattern),
    Cancelled: _            => pattern.onCancelled(), 
    Resolved:  ({ value })  => pattern.onResolved(value),
    Rejected:  ({ reason }) => pattern.onRejected(reason)
  });
};




module.exports = {
  Task: (computation, onCancel, cleanup) => new Task(computation, onCancel, cleanup)
};

