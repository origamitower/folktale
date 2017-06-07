//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

const provideAliases = require('folktale/helpers/provide-fantasy-land-aliases');
const defer = require('folktale/helpers/defer');
const Deferred = require('folktale/concurrency/future/_deferred');
const TaskExecution = require('./_task-execution');


const noop = () => {};


/*~ stability: experimental */
class Task {
  /*~
   * stability: experimental
   * type: |
   *   forall value, reason:
   *     new (
   *       ({
   *          resolve: (value) => Void,
   *          reject: (reason) => Void,
   *          cancel: () => Void,
   *          cleanup: (() => Void) => Void,
   *          onCancelled: (() => Void) => Void,
   *          get isCancelled: Boolean
   *        }) => Void
   *     ) => Task value reason
   */
  constructor(computation) {
    this._computation = computation;
  }

  /*~
   * stability: experimental
   * type: |
   *   forall e, v1, v2:
   *     (Task e v1).((v1) => Task e v2) => Task e v2
   */
  chain(transformation) {
    return new Task(resolver => {
      const execution = this.run();
      resolver.onCancelled(() => execution.cancel());

      execution.listen({
        onCancelled: resolver.cancel,
        onRejected:  resolver.reject,
        onResolved:  value => {
          transformation(value).run().listen({
            onCancelled: resolver.cancel,
            onRejected:  resolver.reject,
            onResolved:  resolver.resolve
          });
        }
      });
    });
  }

  /*~
   * stability: experimental
   * type: |
   *   forall e, v1, v2:
   *     (Task e v1).((v1) => v2) => Task e v2
   */
  map(transformation) {
    return new Task(resolver => {
      const execution = this.run();
      resolver.onCancelled(() => execution.cancel());

      execution.listen({
        onCancelled: resolver.cancel,
        onRejected:  resolver.reject,
        onResolved:  value => resolver.resolve(transformation(value))
      });
    });
  }

  /*~
   * stability: experimental
   * type: |
   *   forall e1, e2, v:
   *     (Task e1 v).((e1) => e2) => Task e2 v
   */
  mapRejected(transformation) {
    return new Task(resolver => {
      const execution = this.run();
      resolver.onCancelled(() => execution.cancel());

      execution.listen({
        onCancelled: resolver.cancel,
        onRejected:  reason => resolver.reject(transformation(reason)),
        onResolved:  resolver.resolve
      });
    });
  }

  /*~
   * stability: experimental
   * type: |
   *   forall e, v1, v2:
   *     (Task e ((v1) => v2)).(Task e v1) => Task e v2
   */
  apply(task) {
    return this.chain(f => task.map(f));
  }

  /*~
   * stability: experimental
   * type: |
   *   forall e1, e2, v1, v2:
   *     (Task e1 v1).((e1) => e2, (v1) => v2) => Task e2 v2
   */
  bimap(rejectionTransformation, successTransformation) {
    return new Task(resolver => {
      const execution = this.run();
      resolver.onCancelled(() => execution.cancel());

      execution.listen({
        onCancelled: resolver.cancel,
        onRejected:  reason => resolver.reject(rejectionTransformation(reason)),
        onResolved:  value => resolver.resolve(successTransformation(value))
      });
    });
  }

  /*~
   * stability: experimental
   * type: |
   *   forall e1, e2, v1, v2:
   *     type Pattern = { row |
   *       Cancelled: ()  => Task e2 v2,
   *       Resolved:  (b) => Task e2 v2,
   *       Rejected:  (a) => Task e2 v2
   *     }
   *
   *     (Task e1 v1).(Pattern) => Task e2 v2
   */
  willMatchWith(pattern) {
    return new Task(resolver => {
      const execution = this.run();
      resolver.onCancelled(() => execution.cancel());
      
      const resolve = (handler) => (value) => handler(value).run().listen({
        onCancelled: resolver.cancel,
        onRejected:  resolver.reject,
        onResolved:  resolver.resolve
      });
      execution.listen({
        onCancelled: resolve(_ => pattern.Cancelled()),
        onRejected:  resolve(pattern.Rejected),
        onResolved:  resolve(pattern.Resolved)
      });
    });
  }

  /*~
   * stability: experimental
   * type: |
   *   forall e, v: (Task e v).() => Task v e
   */
  swap() {
    return new Task(resolver => {
      let execution = this.run();   // eslint-disable-line prefer-const
      resolver.onCancelled(() => execution.cancel());

      execution.listen({
        onCancelled: resolver.cancel,
        onRejected:  resolver.resolve,
        onResolved:  resolver.reject
      });
    });
  }

  /*~
   * stability: experimental
   * type: |
   *   forall e, e2, v:
   *     (Task e v).((e) => Task e2 v) => Task e2 v
   */
  orElse(handler) {
    return new Task(resolver => {
      const execution = this.run();
      resolver.onCancelled(() => execution.cancel());

      execution.listen({
        onCancelled: resolver.cancel,
        onResolved:  resolver.resolve,
        onRejected:  reason => {
          handler(reason).run().listen({
            onCancelled: resolver.cancel,
            onRejected:  resolver.reject,
            onResolved:  resolver.resolve
          });
        }
      });
    });
  }


  /*~
   * stability: experimental
   * type: |
   *   forall e, v:
   *     (Task e v).(Task e v) => Task e v
   */
  or(that) {
    return new Task(resolver => {
      let thisExecution = this.run();   // eslint-disable-line prefer-const
      let thatExecution = that.run();   // eslint-disable-line prefer-const
      let done = false;

      resolver.onCancelled(() => {
        thisExecution.cancel();
        thatExecution.cancel();
      });

      const guard = (fn, execution) => (value) => {
        if (!done) {
          done = true;
          execution.cancel();
          fn(value);
        }
      };

      thisExecution.listen({
        onRejected:  guard(resolver.reject, thatExecution),
        onCancelled: guard(resolver.cancel, thatExecution),
        onResolved:  guard(resolver.resolve, thatExecution)
      });

      thatExecution.listen({
        onRejected:  guard(resolver.reject, thisExecution),
        onCancelled: guard(resolver.cancel, thisExecution),
        onResolved:  guard(resolver.resolve, thisExecution)
      });
    });
  }

  /*~
   * stability: experimental
   * type: |
   *   forall e, v1, v2:
   *     (Task e v1).(Task e v2) => Task e (v1, v2)
   */
  and(that) {
    return new Task(resolver => {   // eslint-disable-line max-statements
      let thisExecution = this.run();   // eslint-disable-line prefer-const
      let thatExecution = that.run();   // eslint-disable-line prefer-const
      let valueLeft = null;
      let valueRight = null;
      let doneLeft = false;
      let doneRight = false;
      let cancelled = false;

      resolver.onCancelled(() => {
        thisExecution.cancel();
        thatExecution.cancel();
      });

      const guardResolve = (setter) => (value) => {
        if (cancelled)  return;

        setter(value);
        if (doneLeft && doneRight) {
          resolver.resolve([valueLeft, valueRight]);
        }
      };

      const guardRejection = (fn, execution) => (value) => {
        if (cancelled)  return;

        cancelled = true;
        execution.cancel();
        fn(value);
      };

      thisExecution.listen({
        onRejected:  guardRejection(resolver.reject, thatExecution),
        onCancelled: guardRejection(resolver.cancel, thatExecution),
        onResolved:  guardResolve(x => {
          valueLeft = x;
          doneLeft = true;
        })
      });

      thatExecution.listen({
        onRejected:  guardRejection(resolver.reject, thisExecution),
        onCancelled: guardRejection(resolver.cancel, thisExecution),
        onResolved:  guardResolve(x => {
          valueRight = x;
          doneRight = true;
        })
      });
    });
  }

  /*~
   * stability: experimental
   * type: |
   *   forall e, v: (Task e v).() => TaskExecution e v
   */
  run() {
    let deferred = new Deferred();    // eslint-disable-line prefer-const
    let cleanups      = [];
    let cancellations = [];
    let isCancelled   = false;
    let done          = false;

    deferred.listen({
      onCancelled: _ => {
        done = true;
        isCancelled = true;
        cancellations.forEach(f => f());
        cleanups.forEach(f => f());
        cancellations = [];
        cleanups = [];
      },

      onResolved: _value => {
        done = true;
        cleanups.forEach(f => f());
        cleanups = [];
        cancellations = [];
      },

      onRejected: _reason => {
        done = true;
        cleanups.forEach(f => f());
        cleanups = [];
        cancellations = [];
      }
    });

    const resources = this._computation({
      reject:  error => { deferred.reject(error) },
      resolve: value => { deferred.resolve(value) },
      cancel:  _     => { deferred.maybeCancel() },

      get isCancelled() { return isCancelled },
      cleanup(f) {
        if (done) {
          throw new Error('Can\'t attach a cleanup handler after the task is settled.');
        }
        cleanups.push(f);
      },
      onCancelled(f) {
        if (done) {
          throw new Error('Can\'t attach a cancellation handler after the task is settled.');
        }
        cancellations.push(f);
      }
    });

    return new TaskExecution(this, deferred);
  }
}


Object.assign(Task, {
  /*~
   * stability: experimental
   * type: |
   *   forall e, v: (v) => Task e v
   */
  of(value) {
    return new Task(resolver => resolver.resolve(value));
  },

  /*~
   * stability: experimental
   * type: |
   *   forall e, v: (e) => Task e v
   */
  rejected(reason) {
    return new Task(resolver => resolver.reject(reason));
  }
});

provideAliases(Task);
provideAliases(Task.prototype);

module.exports = Task;
