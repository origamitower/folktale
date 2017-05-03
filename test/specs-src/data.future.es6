//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

const assert = require('assert');
const { property, forall} = require('jsverify');
const env = require('./environment');

const Future = require('folktale/data/future');
const { _ExecutionState, _Deferred: Deferred } = Future;
const { Resolved, Rejected } = _ExecutionState;

describe('Data.Future', function() {
  describe('Deferreds', function() {
    it('new Deferred() should start in a pending state', () => {
      let deferred = new Deferred();
      $ASSERT(deferred._state == _ExecutionState.Pending());
    });

    it('shouldnt allow resolving more than once', () => {
      assert.throws(_ => {
        let a = new Deferred();
        a.resolve(1);
        a.resolve(2);
      });

      assert.throws(_ => {
        let a = new Deferred();
        a.resolve(1);
        a.reject(2);
      });

      assert.throws(_ => {
        let a = new Deferred();
        a.resolve(1);
        a.cancel();
      });

      assert.throws(_ => {
        let a = new Deferred();
        a.reject(1);
        a.resolve(2);
      });

      assert.throws(_ => {
        let a = new Deferred();
        a.reject(1);
        a.reject(2);
      });

      assert.throws(_ => {
        let a = new Deferred();
        a.reject(1);
        a.cancel();
      });

      assert.throws(_ => {
        let a = new Deferred();
        a.cancel();
        a.resolve(2);
      });

      assert.throws(_ => {
        let a = new Deferred();
        a.cancel();
        a.reject(2);
      });

      assert.throws(_ => {
        let a = new Deferred();
        a.cancel();
        a.cancel();
      });      
    });

    it('should notify when resolved', () => {
      let xs = [0, 0, 0];
      const pattern = {
        onCancelled: _ => ++xs[0],
        onResolved:  v => xs[1] += v,
        onRejected:  v => xs[2] += v
      };

      let a = new Deferred();
      a.listen(pattern);
      a.resolve(2);
      $ASSERT(xs == [0, 2, 0]);

      let b = new Deferred();
      b.listen(pattern);
      b.reject(3);
      $ASSERT(xs == [0, 2, 3]);

      let c = new Deferred();
      c.listen(pattern);
      c.cancel();
      $ASSERT(xs == [1, 2, 3]);
    });

    it('should call all listeners when resolved', () => {
      let x = 0;
      const pattern = {
        onResolved: v => x += v
      };
      
      let a = new Deferred();
      a.listen(pattern);
      a.listen(pattern);
      a.listen(pattern);
      a.resolve(2);

      $ASSERT(x === 6);
    });

    it('should call all listeners when rejected', () => {
      let x = 0;
      const pattern = {
        onRejected: v => x += v
      };
      
      let a = new Deferred();
      a.listen(pattern);
      a.listen(pattern);
      a.listen(pattern);
      a.reject(2);

      $ASSERT(x === 6);
    });

    it('should call all listeners when cancelled', () => {
      let x = 0;
      const pattern = {
        onCancelled: () => ++x
      };
      
      let a = new Deferred();
      a.listen(pattern);
      a.listen(pattern);
      a.listen(pattern);
      a.cancel();

      $ASSERT(x === 3);
    });  

    describe('#resolve(a)', _ => {
      property('deferred.resolve(a) should resolve with the given value', 'nat', a => {
        let deferred = new Deferred();
        deferred.resolve(a);
        return deferred._state.equals(_ExecutionState.Resolved(a));
      });
    });

    describe('#reject(a)', _ => {
      property('deferred.reject(a) should reject with the given value', 'nat', a => {
        let deferred = new Deferred();
        deferred.reject(a);
        return deferred._state.equals(_ExecutionState.Rejected(a));
      });
    });

    describe('#cancel()', _=> {
      property('deferred.cancel() should cancel', 'nat', a => {
        let deferred = new Deferred();
        deferred.cancel();
        return deferred._state.equals(_ExecutionState.Cancelled());
      });
    });

    it('#future() should give a future with the same state', () => {
      let a = new Deferred();
      let af = a.future();
      $ASSERT(af._state == _ExecutionState.Pending());

      a.resolve(1);
      $ASSERT(af._state == _ExecutionState.Resolved(1));

      let b = new Deferred();
      let bf = b.future();
      
      $ASSERT(bf._state == _ExecutionState.Pending());

      b.reject(1);
      $ASSERT(bf._state == _ExecutionState.Rejected(1));

      let c = new Deferred();
      let cf = c.future();
      
      $ASSERT(cf._state == _ExecutionState.Pending());

      c.cancel();
      $ASSERT(cf._state == _ExecutionState.Cancelled());
    });

    it('#promise() should give a future with the same state', async function() {
      let a = new Deferred();
      let af = a.promise();

      a.resolve(1);
      $ASSERT((await af) == 1);

      let b = new Deferred();
      let bf = b.promise();

      b.reject(2);
      $ASSERT((await bf.catch(v => v)) == 2);

      let c = new Deferred();
      let cf = c.promise();

      c.cancel();
      $ASSERT(_ExecutionState.Cancelled.hasInstance(await cf.catch(v => v)));
    });
  });

  describe('Future', _ => {
    const cancelled = () => {
      const b = new Deferred();
      b.cancel();
      return b.future();
    };

    function eq(b) {
      return this._state.equals(b._state);
    }

    property('#of(v) should create a resolved Future with v', 'nat', v => {
      return Future.of(v)._state.equals(Resolved(v));
    });

    property('#rejected(v) should create a rejected Future with v', 'nat', v => {
      return Future.rejected(v)._state.equals(Rejected(v));
    });

    it('#listen(p) should invoke the right branch for the future', () => {
      let x = [0, 0, 0];
      const pattern = {
        onCancelled: () => x[0]++,
        onResolved:  () => x[1]++,
        onRejected:  () => x[2]++
      };

      Future.of(1).listen(pattern);
      Future.rejected(1).listen(pattern);
      let a = new Deferred();
      let b = a.future();
      b.listen(pattern);
      a.cancel();

      $ASSERT(x == [1, 1, 1]);
    });

    property('#chain(f) transforms the successful value', 'nat', 'nat -> future nat', env, (a, f) => {
      return Future.of(a).chain(f) ::eq(f(a));
    });

    property('#chain(f) shouldnt transform rejections', 'nat', 'nat -> future nat', env, (a, f) => {
      return Future.rejected(a).chain(f) ::eq(Future.rejected(a));
    });

    property('#chain(f) shouldnt transform cancellations', 'nat', 'nat -> future nat', env, (a, f) => {
      return cancelled().chain(f) ::eq(cancelled());
    });

    property('#map(f) transforms the successful value', 'nat', 'nat -> nat', (a, f) => {
      return Future.of(a).map(f) ::eq(Future.of(f(a)));
    });

    property('#map(f) ignores rejections', 'nat', 'nat -> nat', (a, f) => {
      return Future.rejected(a).map(f) ::eq(Future.rejected(a));
    });

    property('#map(f) ignores cancellations', 'nat', 'nat -> nat', (a, f) => {
      return cancelled().map(f) ::eq(cancelled());
    });

    property('#apply(a) applies the function to the applicative a', 'nat', 'nat -> nat', (a, f) => {
      return Future.of(f).apply(Future.of(a)) ::eq(Future.of(f(a)));
    });

    property('#apply(a) ignores rejections', 'nat', 'nat -> nat', (a, f) => {
      return Future.rejected(f).apply(Future.of(a)) ::eq(Future.rejected(f));
    });

    property('#apply(a) ignores cancellations', 'nat', 'nat -> nat', (a, f) => {
      return cancelled().apply(Future.of(a)) ::eq(cancelled());
    });

    property('#bimap(f, g) applies g for successes', 'nat', 'nat -> nat', 'nat -> nat', (a, f, g) => {
      return Future.of(a).bimap(f, g) ::eq(Future.of(g(a)));
    });

    property('#bimap(f, g) applies f for rejections', 'nat', 'nat -> nat', 'nat -> nat', (a, f, g) => {
      return Future.rejected(a).bimap(f, g) ::eq(Future.rejected(f(a)));
    });

    property('#bimap(f, g) ignores cancellations', 'nat', 'nat -> nat', 'nat -> nat', (a, f, g) => {
      return cancelled().bimap(f, g) ::eq(cancelled());
    });

    property('#mapRejected(f) ignores successes', 'nat', 'nat -> nat', (a, f) => {
      return Future.of(a).mapRejected(f) ::eq(Future.of(a));
    });

    property('#mapRejected(f) transforms rejections', 'nat', 'nat -> nat', (a, f) => {
      return Future.rejected(a).mapRejected(f) ::eq(Future.rejected(f(a)));
    });

    property('#mapRejected(f) ignores cancellations', 'nat', 'nat -> nat', (a, f) => {
      return cancelled().mapRejected(f) ::eq(cancelled());
    });

    property('#recover(f) ignores successes', 'nat', 'nat -> future nat', env, (a, f) => {
      return Future.of(a).recover(f) ::eq(Future.of(a));
    });

    property('#recover(f) applies f to rejections', 'nat', 'nat -> future nat', env, (a, f) => {
      return Future.rejected(a).recover(f) ::eq(f(a));
    });

    property('#recover(f) ignores cancellations', 'nat', 'nat -> future nat', env, (a, f) => {
      return cancelled().recover(f) ::eq(cancelled());
    });

    property('#willMatchWith(pattern) invokes the proper pattern', 'nat', 'nat -> future nat', 'nat -> future nat', 'nat -> future nat', env, (a, f, g, h) => {
      const pattern = {
        Cancelled: f,
        Resolved: g,
        Rejected: h
      };

      $ASSERT(Future.of(a).willMatchWith(pattern)       ::eq(g(a)));
      $ASSERT(Future.rejected(a).willMatchWith(pattern) ::eq(h(a)));
      $ASSERT(cancelled().willMatchWith(pattern)        ::eq(f()));
      return true;
    });

    property('#swap() swaps rejections and successes', 'nat', (a, b) => {
      return Future.of(a).swap()       ::eq(Future.rejected(a))
      &&     Future.rejected(b).swap() ::eq(Future.of(b));
    });

    property('#swap() ignores cancellations', 'nat', (a) => {
      return cancelled().swap() ::eq(cancelled());
    });

    property('#of(value) constructs a future with resolved value', 'nat', (a) => {
      return Future.of(a)._state.equals(Resolved(a));
    });

    property('#rejected(value) constructs a future with rejected value', 'nat', (a) => {
      return Future.rejected(a)._state.equals(Rejected(a));
    });
  });
});
