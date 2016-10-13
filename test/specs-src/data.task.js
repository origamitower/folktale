const { property } = require('jsverify');
const env = require('./environment');

const Task = require('folktale/data/task');
const Future = require('folktale/data/future');
const { _ExecutionState, Deferred } = Future;
const { Resolved, Rejected } = _ExecutionState;

const cancelled = () => {
  const d = new Deferred();
  d.cancel();
  return d.future();
};

const eq = function(that) {
  return this._state.equals(that._state);
}


describe('Data.Task', () => {
  describe('Tasks', () => {
    property('#chain(f) transforms successful tasks', 'nat', 'nat -> task nat', env, (a, f) => {
      return Task.of(a).chain(f).run().future() ::eq(f(a).run().future());
    });

    property('#chain(f) ignores failures', 'nat', 'nat -> task nat', env, (a, f) => {
      return Task.rejected(a).chain(f).run().future() ::eq(Future.rejected(a));
    });

    property('#chain(f) ignores cancellations', 'nat', 'nat -> task nat', env, (a, f) => {
      const execution = Task.task(r => r.cancel()).run();
      return execution.future() ::eq(cancelled());
    });

    property('#map(f) transforms successful tasks', 'nat', 'nat -> nat', (a, f) => {
      return Task.of(a).map(f).run().future() ::eq(Future.of(f(a)));
    });

    property('#map(f) ignores failures', 'nat', 'nat -> nat', (a, f) => {
      return Task.rejected(a).map(f).run().future() ::eq(Future.rejected(a));
    });

    property('#map(f) ignores cancellations', 'nat', 'nat -> nat', (a, f) => {
      return Task.task(r => r.cancel()).run().future() ::eq(cancelled());
    });

    property('#apply(a) applies successes', 'nat', 'nat -> nat', (a, f) => {
      return Task.of(f).apply(Task.of(a)).run().future() ::eq(Future.of(f(a)));
    });

    property('#apply(a) ignores failures', 'nat', 'nat -> nat', (a, f) => {
      return Task.rejected(f).apply(Task.of(a)).run().future() ::eq(Future.rejected(f));
    });

    property('#apply(a) ignores cancellations', 'nat', 'nat -> nat', (a, f) => {
      return Task.task(r => r.cancel()).apply(Task.of(a)).run().future()
      ::eq   (cancelled());
    });

    property('#bimap(f, g) applies g to successes', 'nat', 'nat -> nat', 'nat -> nat', (a, f, g) => {
      return Task.of(a).bimap(f, g).run().future() ::eq(Future.of(g(a)));
    });

    property('#bimap(f, g) applies f to failures', 'nat', 'nat -> nat', 'nat -> nat', (a, f, g) => {
      return Task.rejected(a).bimap(f, g).run().future() ::eq(Future.rejected(f(a)));
    });

    property('#bimap(f, g) ignores cancellation', 'nat', 'nat -> nat', 'nat -> nat', (a, f, g) => {
      return Task.task(r => r.cancel()).bimap(f, g).run().future() ::eq(cancelled());
    });
  });
});
