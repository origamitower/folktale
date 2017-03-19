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
const Deferred = require('folktale/data/future/_deferred');
const TaskExecution = require('./_task-execution');


const noop = () => {};


/*~ stability: experimental */
class Task {
  /*~
   * stability: experimental
   *
   * type Resources = Any
   *
   * type Computation = ({ resolve: (value is Any) -> X, reject: (reason is Any) -> X , cancel: () -> X }) -> Resources
   *
   * type OnCancel = Resources -> Any
   *
   * type Cleanup = Resources -> Any
   *
   * type: |
   *     (Computation, OnCancel, Cleanup) -> Task reason value
   */
  constructor(computation, onCancel, cleanup) {
    this._computation = computation;
    this._onCancel    = onCancel || noop;
    this._cleanup     = cleanup  || noop;
  }

  /*~
   * stability: experimental
   * type: |
   *   forall a, b, c:
   *     (Task a b).((b) => Task a c) => Task a c
   */
  chain(transformation) {
    return new Task(
      resolver => {
        const execution = this.run();
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
        return execution;
      },
      execution => execution.cancel()
    );
  }

  /*~
   * stability: experimental
   * type: |
   *   forall a, b, c:
   *     (Task a b).((b) => c) => Task a c
   */
  map(transformation) {
    return new Task(
      resolver => {
        const execution = this.run();
        execution.listen({
          onCancelled: resolver.cancel,
          onRejected:  resolver.reject,
          onResolved:  value => resolver.resolve(transformation(value))
        });
        return execution;
      },
      execution => execution.cancel()
    );
  }

  /*~
   * stability: experimental
   * type: |
   *   forall a, b, c:
   *     (Task a ((b) => c)).(Task a b) => Task a c
   */
  apply(task) {
    return this.chain(f => task.map(f));
  }

  /*~
   * stability: experimental
   * type: |
   *   (Task a b).((a) => c, (b) => d) => Task c d
   */
  bimap(rejectionTransformation, successTransformation) {
    return new Task(
      resolver => {
        const execution = this.run();
        execution.listen({
          onCancelled: resolver.cancel,
          onRejected:  reason => resolver.reject(rejectionTransformation(reason)),
          onResolved:  value => resolver.resolve(successTransformation(value))
        });
        return execution;
      },
      execution => execution.cancel()
    );
  }

  /*~
   * stability: experimental
   * type: |
   *   forall a, b, c, d:
   *     type Pattern = { r |
   *       Cancelled: ()  => Task c d,
   *       Resolved:  (b) => Task c d,
   *       Rejected:  (a) => Task c d
   *     }
   *
   *     (Task a b).(Pattern) => Task c d
   */
  willMatchWith(pattern) {
    return new Task(
      resolver => {
        const execution = this.run();
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
        return execution;
      },
      execution => execution.cancel()
    );
  }

  /*~
   * stability: experimental
   * type: |
   *   forall a, b: (Task a b).() => Task b a
   */
  swap() {
    return new Task(
      resolver => {
        let execution = this.run();   // eslint-disable-line prefer-const
        execution.listen({
          onCancelled: resolver.cancel,
          onRejected:  resolver.resolve,
          onResolved:  resolver.reject
        });
        return execution;
      },
      execution => execution.cancel()
    );
  }

  /*~
   * stability: experimental
   * type: |
   *   forall a, b, c, d:
   *     (Task a b).(Task c d) => (Task a b) or (Task c d)
   */
  or(that) {
    return new Task(
      resolver => {
        let thisExecution = this.run();   // eslint-disable-line prefer-const
        let thatExecution = that.run();   // eslint-disable-line prefer-const
        let done = false;

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

        return [thisExecution, thatExecution];
      },
      ([thisExecution, thatExecution]) => {
        thisExecution.cancel();
        thatExecution.cancel();
      }
    );
  }

  /*~
   * stability: experimental
   * type: |
   *   forall a, b, c: (Task a b).(Task a c) => Task a (b, c)
   */
  and(that) {
    return new Task(
      resolver => {   // eslint-disable-line max-statements
        let thisExecution = this.run();   // eslint-disable-line prefer-const
        let thatExecution = that.run();   // eslint-disable-line prefer-const
        let valueLeft = null;
        let valueRight = null;
        let doneLeft = false;
        let doneRight = false;
        let cancelled = false;

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

        return [thisExecution, thatExecution];
      },
      ([thisExecution, thatExecution]) => {
        thisExecution.cancel();
        thatExecution.cancel();
      }
    );
  }

  /*~
   * stability: experimental
   * type: |
   *   forall a, b: (Task a b).() => TaskExecution a b
   */
  run() {
    let deferred = new Deferred();    // eslint-disable-line prefer-const
    deferred.listen({
      onCancelled: _ => {
        defer(_ => {
          this._onCancel(resources);
          this._cleanup(resources);
        });
      },

      onResolved: _value => {
        defer(_ => {
          this._cleanup(resources);
        });
      },

      onRejected: _reason => {
        defer(_ => {
          this._cleanup(resources);
        });
      }
    });

    const resources = this._computation({
      reject:  error => { deferred.reject(error) },
      resolve: value => { deferred.resolve(value) },
      cancel:  _     => { deferred.maybeCancel() }
    });

    return new TaskExecution(this, deferred);
  }
}


Object.assign(Task, {
  /*~
   * stability: experimental
   * type: |
   *   forall a, b: (b) => Task a b
   */
  of(value) {
    return new Task(resolver => resolver.resolve(value));
  },

  /*~
   * stability: experimental
   * type: |
   *   forall a, b: (a) => Task a b
   */
  rejected(reason) {
    return new Task(resolver => resolver.reject(reason));
  }
});

provideAliases(Task);
provideAliases(Task.prototype);

module.exports = Task;
