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


## Constructing tasks

The `task` function is how Tasks are generally created. It takes a computation (a function that will perform all of the work), and optionally an object defining handlers for how to clean up the resources allocated by the computation, and what to do if the task is cancelled.

A task that simply resolves after a certain amount of time would look like this::

    const { task } = require('folktale/data/task');

    const delay = (time) => task(
      (resolver) => {
        return setTimeout(() => resolver.resolve(time), time);
      },
      {
        cleanup(timerId) {
          clearTimeout(timerId);
        },
        onCancelled(timerId) {
          /* does nothing */
        }
      }
    );

    const result = await delay(100).run().promise();
    $ASSERT(result == 100);

Here the computation takes a `resolver` argument, which contains methods to change the state of the task execution. `resolver.resolve(value)` signals that the execution succeeded, and provides a return value for it. `resolver.reject(reason)` signals that the execution failed, and provides the reason of its failure. `resolver.cancel()` cancels the exection of the task.

> **NOTE**  
> While `.cancel()` will cancel the execution of the Task, the processes started by the task computation will not be automatically stopped. The task computation must stop those itself, as we'll see later in the section about cancelling tasks.

The `onCancelled` and `cleanup` functions will receive any value returned by the task computation. Typically, the computation will allocate some resources, and return a handle to those resources such that `cleanup` and `onCancelled` may free those as they see fit. `cleanup` is always called once a Task finishes its execution, regardless of what state it ends up in (cancelled, rejected, or resolved). If not provided, Folktale just does nothing in response to those events.

Sometimes Task functions expect a Task as input or result value, but you already have the value that should be computed. While you can always resolve a Task synchronously, like so::

    const one = task(resolver => resolver.resolve(1));

It's practical to use the `of()` and `rejected()` methods instead. The first creates a task that resolves successfuly with a value, whereas `rejected()` creates a task that resolves with a failure::

    const { of, rejected } = require('folktale/data/task');

    const one_ = of(1);
    const two_ = rejected(2);


## Running tasks

Creating a Task does **not** start any computation, it only provides a description for how to do something. In a sense, they are similar to a function definition. In order to execute the operations a Task defines, one must run it::

    const { task } = require('folktale/data/task');

    const hello = task(resolver => resolver.resolve('hello'));

    const helloExecution = hello.run();


Running a Task with the `.run()` method returns a `TaskExecution` object. This object allows one to cancel the execution of the task, or query its eventual value either as JavaScript's Promise, or a Folktale's Future::

    const value = await helloExecution.promise();
    $ASSERT(value === 'hello');

    helloExecution.future().map(value => {
      $ASSERT(value === 'hello');
    });

> **NOTE**  
> While Promises let you use JavaScript's `async/await` feature, it does not support nested promises, and cancellations are handled as rejections. Future is a simpler structure, which models all three states of a Task's eventual value, but does not support `async/await`.


## Combining tasks concurrently

Task's primary goal is helping with concurrency, or the ordering of independent processes within an application. There are three primary categories of operations for this in Folktale:

  - **Sequencing**: when process A depends on process B, and thus must only be executed after A is done.
  - **Choosing non-deterministically**: A and B are independent processes that provide a similar answer. The program chooses the first process that finishes.
  - **Waiting related processes**: A and B are independent processes, but C depends on both, and thus must only be executed after A and B are done.


### Sequencing tasks

One task models and independent process that eventually computes a value. Sometimes one task depends on the result of another task, and as thus may only run if that task resolves successfully. In order to sequence tasks we use the `.chain()` method::

    const { task, of } = require('folktale/data/task');

    const concat = (a, b) => task(resolver => resolver.resolve(a + b));

    const taskA = of('hello');
    const taskB = of('world');

    const theTask = taskA.chain(x => taskB.chain(y => concat(x, y)));

    const result = await theTask.run().promise();
    $ASSERT(result == 'helloworld');

In this case, `taskB` only starts after `taskA` finishes executing successfully, and `concat` only starts after both `taskA` and `taskB` finish executing. It makes sense for `concat` to wait on both `taskA` and `taskB`, as it needs the two tasks to finish successfully before it can be executed, but there's no reason for `taskA` and `taskB` to wait for each other.


### Choosing the first of N tasks

Suppose you send a request to a server, but if you don't get a response in a couple of seconds the program should just give up. This scenario can be modelled as two independent processes: a request to a server, and a timer that fires after a couple of seconds. The program should pick whichever process resolves first. With Folktale's Task, this is done with the `.or()` method.

The `.or()` method combines two tasks such that the resulting task assimilates the result of the first one to resolve::

    const { task } = require('folktale/data/task');

    const delay = (ms) => task(
      resolver => setTimeout(() => resolver.resolve(ms), ms),
      {
        cleanup: (timer) => clearTimeout(timer)
      }
    );

    const timeout = (ms) => task(
      resolver => setTimeout(() => resolver.reject(ms), ms),
      {
        cleanup: (timer) => clearTimeout(timer)
      }
    );

    const result = await delay(20).or(timeout(300))
                     .run().promise();
    $ASSERT(result == 20);

    const result2 = await delay(200).or(timeout(100))
                      .run().promise().catch(e => `timeout ${e}`);
    $ASSERT(result2 == 'timeout 100');

