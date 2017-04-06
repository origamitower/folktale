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
   * type: |
   *   forall value, reason, resources:
   *     new (
   *       ({ resolve: (value) => Void, reject: (reason) => Void, cancel: () => Void }) => resources,
   *       (resources) => Void,
   *       (resources) => Void
   *     ) => Task value reason resources
   */
  constructor(computation, onCancel, cleanup) {
    this._computation = computation;
    this._onCancel    = onCancel || noop;
    this._cleanup     = cleanup  || noop;
  }

  /*~
   * stability: experimental
   * type: |
   *   forall e, v1, v2, r:
   *     (Task e v1 r).((v1) => Task e v2 r) => Task e v2 r
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
   *   forall e, v1, v2, r:
   *     (Task e v1 r).((v1) => v2) => Task e v2 r
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
   *   forall e, v1, v2, r:
   *     (Task e ((v1) => v2) r).(Task e v1 r) => Task e v2 r
   */
  apply(task) {
    return this.chain(f => task.map(f));
  }

  /*~
   * stability: experimental
   * type: |
   *   forall e1, e2, v1, v2, r:
   *     (Task e1 v1 r).((e1) => e2, (v1) => v2) => Task e2 v2 r
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
   *   forall e1, e2, v1, v2, r:
   *     type Pattern = { row |
   *       Cancelled: ()  => Task e2 v2 r,
   *       Resolved:  (b) => Task e2 v2 r,
   *       Rejected:  (a) => Task e2 v2 r
   *     }
   *
   *     (Task e1 v1 r).(Pattern) => Task e2 v2 r
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
   *   forall e, v, r: (Task e v r).() => Task v e r
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
   *   forall e, v, r1, r2:
   *     (Task e v r1).(Task e v r2) => Task e v (r1 and r2)
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
   *   forall e, v1, v2, r1, r2:
   *     (Task e v1 r1).(Task e v2 r2) => Task e (v1, v2) (r1 and r2)
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
   *   forall e, v, r: (Task e v r).() => TaskExecution e v r
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
   *   forall e, v, r: (v) => Task e v r
   */
  of(value) {
    return new Task(resolver => resolver.resolve(value));
  },

  /*~
   * stability: experimental
   * type: |
   *   forall e, v, r: (e) => Task e v r
   */
  rejected(reason) {
    return new Task(resolver => resolver.reject(reason));
  }
});

provideAliases(Task);
provideAliases(Task.prototype);

module.exports = Task;
