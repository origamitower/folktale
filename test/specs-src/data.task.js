const { property } = require('jsverify');
const env = require('./environment');

const Task = require('folktale/data/task');
const Future = require('folktale/data/future');
const { _ExecutionState, Deferred } = Future;
const { Resolved, Rejected, Cancelled } = _ExecutionState;

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

    describe('#willMatchWith(pattern)', () => {
      property('calls .Cancelled for cancellations', 'nat', 'nat -> task nat', 'nat -> task nat', 'nat -> task nat', env, (a, f, g, h) => {
        return Task.task(r => r.cancel())
            .willMatchWith({
              Cancelled: f,
              Rejected: g,
              Resolved: h
            })
            .run().future()
        ::eq(f().run().future());
      });

      property('calls .Rejected for rejections', 'nat', 'nat -> task nat', 'nat -> task nat', 'nat -> task nat', env, (a, f, g, h) => {
        return Task.rejected(a)
                   .willMatchWith({
                      Cancelled: f,
                      Rejected: g,
                      Resolved: h
                   }).run().future()
        ::eq(g(a).run().future());
      });

      property('calls .Resolved for successes', 'nat', 'nat -> task nat', 'nat -> task nat', 'nat -> task nat', env, (a, f, g, h) => {
        return Task.of(a)
                   .willMatchWith({
                     Cancelled: f,
                     Rejected: g,
                     Resolved: h
                   }).run().future()
        ::eq(h(a).run().future());
      });
    });
  });

  property('#swap() swaps rejections and successes', 'nat', 'nat', (a, b) => {
    return Task.of(a).swap().run().future()        ::eq(Future.rejected(a))
    &&     Task.rejected(b).swap().run().future()  ::eq(Future.of(b));
  });

  property('#swap() ignores cancellations', () => {
    return Task.task(r => r.cancel()).run().future() ::eq(cancelled());
  });

  describe('#or(that)', () => {
    it('Selects the first resolution', async () => {
      const a = Task.of(1);
      const b = Task.rejected(2);
      const c = Task.of(2);
      const d = Task.rejected(1);

      const v1 = await a.or(b).run().promise();
      $ASSERT(v1 == 1);

      await b.or(a).run().promise().catch(v => $ASSERT(v == 2));
      

      const v2 = await a.or(c).run().promise();
      $ASSERT(v2 == 1);

      await b.or(d).run().promise().catch(v => $ASSERT(v == 2));
    });

    it('Starts tasks in parallel, waits first', async () => {
      let done  = [false, false];
      let start = [false, false];
      const a = Task.task(r => {
        start[0] = true;
        return setTimeout(_ => { done[0] = true; r.resolve(1); }, 150)
      }, { cleanup: x => clearTimeout(x) });
      const b = Task.task(r => {
        start[1] = true;
        return setTimeout(_ => { done[1] = true; r.resolve(2); }, 100)
      }, { cleanup: x => clearTimeout(x) });

      const p = a.or(b).run().promise();
      $ASSERT(start == [true, true]);
      const v = await p;
      $ASSERT(v == 2);
      $ASSERT(done == [false, true]);
    });

    it('Cancels the task that hasn’t resolved', async () => {
      let cancelled = [false, false];
      let cleaned = 0;
      let d = new Deferred();
      const cleanup = (timer) => {
        clearTimeout(timer);
        cleaned++;
        if (cleaned === 2) {
          d.resolve();
        }
      };

      const a = Task.task(r => {
        return setTimeout(r.resolve, 100);
      }, {
        onCancelled: _ => { cancelled[0] = true },
        cleanup: cleanup
      });
      const b = Task.task(r => {
        return setTimeout(r.resolve, 150);
      }, {
        onCancelled: _ => { cancelled[1] = true },
        cleanup: cleanup
      });

      a.or(b).run();
      await d.promise();
      $ASSERT(cancelled == [false, true]);
    });

    it('When cancelled, should cancel both tasks', async () => {
      let cancelled = [false, false];
      let done = 0;
      const d = new Deferred();
      const cleanup = (timer) => {
        clearTimeout(timer);
        done++;
        if (done === 2) {
          d.resolve();
        }
      };

      const a = Task.task(r => {
        return setTimeout(r.resolve, 100)
      }, {
        onCancelled: _ => { cancelled[0] = true },
        cleanup
      });
      const b = Task.task(r => {
        return setTimeout(r.reject, 100)
      }, {
        onCancelled: _ => { cancelled[1] = true },
        cleanup
      });

      a.or(b).run().cancel();
      await d.promise();
      $ASSERT(cancelled == [true, true]);
    });
  });

  describe('#and(that)', () => {
    it('waits for both values in parallel, maintains tuple ordering', async () => {
      const a = Task.task(r => {
        return setTimeout(_ => r.resolve(1), 150);
      }, {
        cleanup: x => clearTimeout(x)
      });

      const b = Task.task(r => {
        return setTimeout(_ => r.resolve(2), 100);
      }, {
        cleanup: x => clearTimeout(x)
      });

      const val = await a.and(b).run().promise();
      $ASSERT(val == [1, 2]);
    });

    it('When cancelled, should cancel both tasks', async () => {
      let cancelled = [false, false];
      let done = 0;
      const d = new Deferred();
      const cleanup = (timer) => {
        clearTimeout(timer);
        done++;
        if (done === 2) {
          d.resolve();
        }
      };

      const a = Task.task(r => {
        return setTimeout(r.resolve, 100)
      }, {
        onCancelled: _ => { cancelled[0] = true },
        cleanup
      });
      const b = Task.task(r => {
        return setTimeout(r.reject, 100)
      }, {
        onCancelled: _ => { cancelled[1] = true },
        cleanup
      });

      a.and(b).run().cancel();
      await d.promise();
      $ASSERT(cancelled == [true, true]);
    });

    it('Cancelling after partial resolution is okay', async () => {
      let resolved = [false, false];
      let cancellations = [false, false];
      let done = 0;
      let d = new Deferred();
      const cleanup = (timer) => {
        clearTimeout(timer);
        done++;
        if (done === 2) {
          d.resolve();
        }
      };

      const a = Task.task(r => {
        return setTimeout(_ => {
          resolved[0] = true;
          r.resolve(1);
        }, 200);
      }, {
        onCancelled: _ => { cancellations[0] = true },
        cleanup
      });

      const b = Task.task(r => {
        return setTimeout(_ => {
          resolved[1] = true;
          r.resolve(2);
        }, 100);
      }, {
        onCancelled: _ => { cancellations[1] = true },
        cleanup
      });

      const ex = a.and(b).run();
      setTimeout(_ => { ex.cancel() }, 120);
      await d.promise();

      $ASSERT(ex.future() ::eq(cancelled()));
      $ASSERT(resolved == [false, true]);
      $ASSERT(cancellations == [true, false]);
    });
  });

  describe('#run()', () => {
    it('Executes the computation for the task', () => {
      let ran = false;
      const a = Task.task(r => {
        ran = true;
        r.resolve(1);
      });
      a.run();
      $ASSERT(ran == true);
    });

    it('Always invokes cleanup after the task resolves', async () => {
      let stack = []; 

      let d = new Deferred();
      Task.task(r => { 
        stack.push(1);
        r.resolve(1)
      }, { 
        cleanup: _ => { 
          stack.push(2);
          d.resolve(2) 
        }
      }).run();
      await d.promise();
      $ASSERT(stack == [1, 2]);

      stack = [];
      d = new Deferred();
      Task.task(r => { 
        stack.push(3);
        r.reject(1)
      }, { 
        cleanup: _ => { 
          stack.push(4);
          d.resolve(2) 
        }
      }).run();
      await d.promise();
      $ASSERT(stack == [3, 4]);

      stack = [];
      d = new Deferred();
      Task.task(r => { 
        stack.push(5);
      }, { 
        cleanup: _ => { 
          stack.push(6);
          d.resolve(2) 
        }
      }).run().cancel();
      await d.promise();
      $ASSERT(stack == [5, 6]);
    });

    it('Invokes onCancel if the task is cancelled', async () => {
      let stack = []; 

      let d = new Deferred();
      Task.task(r => { 
        stack.push(1);
        r.resolve(1)
      }, { 
        cleanup: _ => { 
          stack.push(2);
          d.resolve(2) 
        },
        onCancelled: _ => {
          stack.push(3);
        }
      }).run().cancel();
      await d.promise();
      $ASSERT(stack == [1, 2]);

      stack = [];
      d = new Deferred();
      Task.task(r => { 
        stack.push(3);
        r.reject(1)
      }, { 
        cleanup: _ => { 
          stack.push(4);
          d.resolve(2) 
        },
        onCancelled: _ => {
          stack.push(5);
        }
      }).run();
      await d.promise();
      $ASSERT(stack == [3, 4]);

      stack = [];
      d = new Deferred();
      Task.task(r => { 
        stack.push(5);
      }, { 
        cleanup: _ => { 
          stack.push(6);
          d.resolve(2) 
        },
        onCancelled: _ => {
          stack.push(7);
        }
      }).run().cancel();
      await d.promise();
      $ASSERT(stack == [5, 7, 6]);
    });
  });

  property('#of(v) creates a task containing v', 'nat', (a) => {
    return Task.of(a).run().future() ::eq(Future.of(a));
  });

  property('#rejected(v) creates a rejected task containing v', 'nat', (a) => {
    return Task.rejected(a).run().future() ::eq(Future.rejected(a));
  });


  describe('TaskExecution', () => {
    describe('#listen(pattern)', () => {
      it('invokes pattern.Resolved for successes', () => {
        let a = [0, 0, 0];
        Task.of(1).run().listen({
          onCancelled: _ => a[0]++,
          onRejected: b => a[1] += b,
          onResolved: b => a[2] += b
        });
        $ASSERT(a == [0, 0, 1]);
      });

      it('invokes pattern.Rejected for rejections', () => {
        let a = [0, 0, 0];
        Task.rejected(2).run().listen({
          onCancelled: _ => a[0]++,
          onRejected: b => a[1] += b,
          onResolved: b => a[2] += b
        });
        $ASSERT(a == [0, 2, 0]);
      });

      it('invokes pattern.Cancelled for cancellations', () => {
        let a = [0, 0, 0];
        let ex = Task.task(r => {}).run();
        ex.listen({
          onCancelled: _ => a[0]++,
          onRejected: b => a[1] += b,
          onResolved: b => a[2] += b
        });
        ex.cancel();
        $ASSERT(a == [1, 0, 0]);
      });
    });

    describe('#promise()', () => {
      it('Returns a resolved promise for successes', async () => {
        let a = await Task.of(1).run().promise();
        $ASSERT(a == 1);
      });

      it('Returns a rejected promise for rejections', async () => {
        return Task.rejected(1).run().promise().catch(v => $ASSERT(v == 1));
      });

      it('Returns a rejected promise containing Cancelled for cancellations', async () => {
        let ex = Task.task(r => {}).run();
        ex.cancel();
        return ex.promise().catch(v => $ASSERT(Cancelled.hasInstance(v)));
      });
    });

    describe('#future()', () => {
      property('Returns a resolved future for succeses', 'nat', (a) => {
        return Task.of(a).run().future() ::eq(Future.of(a));
      });

      property('Returns a rejected future for failures', 'nat', (a) => {
        return Task.rejected(a).run().future() ::eq(Future.rejected(a));
      });

      property('Returns a cancelled future for cancellations', () => {
        let ex = Task.task(r => {}).run();
        ex.cancel();
        return ex.future() ::eq(cancelled());
      });
    });
  });
});
