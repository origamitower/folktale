@annotate: folktale.data.task
category: Concurrency
---

A data structure that models asynchronous actions, supporting safe cancellation and automatic resource handling.


## Example::

    const { task } = require('folktale/data/task');

    const delay = (ms) => task(
      (resolver) => setTimeout(() => resolver.resolve(ms), ms),
      {
        cleanup: (timer) => clearTimeout(timer)
      }
    );

    // waits 100ms
    const result = await delay(100).or(delay(2000)).run().promise();
    $ASSERT(result == 100);


## Why use Task?

Because JavaScript implementations are usually single-threaded, and there's no coroutine support, concurrent applications tend to use either callbacks (continuation-passing style) or Promise.

Callbacks aren't very composable. In order to combine callbacks, an user has to write code specific to each place that will use them. While you can make code written using callbacks maintainable, their low-level nature forces you to deal with a fair amount of details that could be resolved by a library, including optimal concurrency::

    const map = (list, fn, done) => {
      let result = [];
      let pending = list.length;
      let resolved = false;

      list.forEach((item, index) => {
        fn(item, (error, value) => {
          if (!resolved) {
            if (error) {
              resolved = true;
              done(error, null);
            } else {
              pending -= 1;
              result[index] = value;
              if (pending === 0) {
                done(null, result);
              }
            }
          }
        });
      });
    };

    map([1, 2], (x, c) => c(null, x + 1), (e, v) => {
      $ASSERT(e == null);
      $ASSERT(v == []);
    });

    map([1, 2], (x, c) => c(x), (e, v) => {
      $ASSERT(e == 1);
      $ASSERT(v == null);
    });

Because no function using callbacks ever returns a value to the caller, and so aren't usable with most functions. They are, of course, not usable with JavaScript control-flow constructs either, so it's not possible to write something like:

    if (someAsyncPredicate(...)) {
      ...
    }

Since `someAsyncPredicate` never returns any value, but instead passes it as an argument to another function.

Promises alleviate this a bit. Promises are first-class values, so regular synchronous functions may invoke functions yielding promises and get a value back. In some cases, that's not going to be the right value, but with [async/await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await) you get a lot of the compositionality back, as you can mix promises and regular synchronous constructs freely in special (`async`) functions.

Promises, however, do not support cancellations. Since they represent values, not computations, a Promise by itself has no concept of "what to cancel", it only waits for an external process to provide a value to it. In JavaScript, promises also suffer from not being able to nest. This is not a problem for most common cases, but it makes writing some data structures much less convenient and more error-prone.

Task, on the other hand, works at the *computation* level, so it knows which resources a computation has allocated to do the work, and can safely collect those resources automatically when the computation is cancelled. Very similar to how killing a thread or process allows you to clean things up. Because Tasks abstract computations, and not values, things that aren't possible with Promises, like running operations sequentially, is supported natively by the Task API.

