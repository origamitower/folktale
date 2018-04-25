---
title: "…from Data.Task"
prev_doc: v2.0.0/migrating/from-data.maybe
next_doc: v2.0.0/migrating/from-data.validation
---

The `Task` structure went through many changes in Folktale 2 to make automatic resource management of asynchronous computations safer and more robust. It also removes the need for the external `control.async` module, by natively supporting combining tasks in the object itself. This page explains how to migrate from the old `Data.Task` to the new `Task` module. You can look at the [full documentation for the concurrency module](/api/v2.0.0/en/folktale.concurrency.html) for more detailed information.


## Contents
{:.no_toc}

* TOC
{:toc}


## Constructing

Previously, to construct a `Task`, you'd pass a computation to the constructor, and this computation would return the resources that were allocated by the task. A second function would take the resources allocated and collect them:

{% highlight js %}
const Task = require('data.task');

function delay(ms) {
  return new Task((reject, resolve) => {
    return setTimeout(
      () => { resolve() },
      ms
    );
  }, (timer) => {
    clearTimeout(timer);
  });
}
{% endhighlight %}

Now, when constructing a Task your computation receives an object that lets you change the state of the Task, and define functions to handle cancellations and deallocating resources. The new Task module also exposes the constructor as a regular function, so you don't use `new` anymore:

{% highlight js %}
const { task } = require('folktale/concurrency/task');

function delay(ms) {
  return task(resolver => {
    const timerId = setTimeout(
      () => { resolver.resolve() },
      ms
    );
    resolver.cleanup(() => {
      clearTimeout(timerId);
    });
  });
}
{% endhighlight %}


## Running tasks

Previously Tasks could be ran by invoking the `.fork(onFailure, onSuccess)` method and providing a callback for successes and failures. This put the burden of collecting resources on the caller of that function:

{% highlight js %}
const Task = require('data.task');

function delay(ms) {
  return new Task((reject, resolve) => {
    return setTimeout(
      () => { resolve() },
      ms
    );
  }, (timer) => {
    clearTimeout(timer);
  });
}

const delayTask = delay(1000);
const resources = delayTask.fork(
  (error) => {
    delayTask.cleanup(resources);
  },
  (value) => {
    delayTask.cleanup(resources);
  }
);
{% endhighlight %}

The new Folktale has improved the execution of Tasks by modelling the execution of a task with a `TaskExecution` object. This object tracks resources and automatically handles them for the user, and allows querying the value of the task or cancelling it easily:

{% highlight js %}
const { task } = require('folktale/concurrency/task');

function delay(ms) {
  return task(resolver => {
    const timerId = setTimeout(
      () => { resolver.resolve() },
      ms
    );
    resolver.cleanup(() => {
      clearTimeout(timerId);
    });
  });
}

delay(100).run();
{% endhighlight %}

To run arbitrary code in response to the result of executing the task, the `listen` method of `TaskExecution` is used in place of the functions one would pass to `Task.fork` before.

Where one used to write:

{% highlight js %}
const Task = require('data.task');

const one = new Task((reject, resolve) => resolve(1));

one.fork(
  (error) => { console.log('something went wrong') },
  (value) => { console.log(`The value is ${value}`) }
);
// logs "The value is 1"
{% endhighlight %}

In Folktale 2 would be:

{% highlight js %}
const { task } = require('folktale/concurrency/task');

const one = task(resolver => resolver.resolve(1));

one.run().listen({
  onCancelled: () => { console.log('the task was cancelled') },
  onRejected: (error) => { console.log('something went wrong') },
  onResolved: (value) => { console.log(`The value is ${value}`) }
});
// logs "The value is 1"
{% endhighlight %}


## Cancelling tasks

Previously there was no formal support for cancellations in Tasks. It was possible to abuse the resource tracking to send a cancellation signal, but that put a lot of burden on Task authors and Task consumers, in particular with more complex tasks and combinations — which would often introduce race conditions that were difficult to predict.

The new `TaskExecution` object now provides a `.cancel()` method for cancellation. This still respects [Object-Capability Security](https://en.wikipedia.org/wiki/Object-capability_model), as the only people who can cancel a Task are those with access to a `TaskExecution` object.

On the Task authors' side, Task now allows providing a callback that gets called when users specifically cancel a Task execution, which is separated from resource cleanups.

{% highlight js %}
const { task } = require('folktale/concurrency/task');

function delay(ms) {
  return task(resolver => {
    const timerId = setTimeout(
      () => { resolver.resolve() },
      ms
    );
    resolver.cleanup(() => {
      clearTimeout(timerId);
    });
    resolver.onCancelled(() => {
      console.log('The delay was cancelled');
    });
  });
}

const execution = delay(100).run();
execution.cancel();
{% endhighlight %}


## Task.ap

While the previous Task had an applicative functor that ran tasks in parallel, the new one runs them sequentially. [This ensures that no weird bugs can occurr in the presence of side-effects](https://github.com/origamitower/folktale/pull/50#issuecomment-254042714).

The new `applicativeFn.apply(applicativeValue)` method is the recommended way of using applicative functors now, which is standardised across Folktale and independent of Fantasy-Land changes.

`.apply` and `.ap` have the same semantics, but those semantics are different from the new `fantasy-land/ap` function! In order to write functions that are generic over different Fantasy-Land implementations and versions, the new [fantasy-land](/api/v2.0.0/en/folktale.fantasy-land.html) module should be used instead.


## Task.concat

Previously Task implemented Semigroup's `concat` as a way of combining tasks non-deterministically:

{% highlight js %}
const Task = require('data.task');
const taskA = new Task(...);
const taskB = new Task(...);

// either the value of A or B
const taskC = taskA.concat(taskB);
{% endhighlight %}

Having non-determinism in an algebraic interface implementation makes the combination of objects, in particular with generic functions, impossible to predict. Because of that Folktale 2 removed `Task#concat`, and the same behaviour is now provided in the Task-specific `or` method:

{% highlight js %}
const { task } = require('folktale/concurrency/task');
const taskA = task(...);
const taskB = task(...);

// either the value of A or B
const taskC = taskA.or(taskB);
{% endhighlight %}


## Task.empty

Previously `Task.empty()` created a Task that never completed. This was used as a sort of Monoid identity together with `Task.concat()`. Folktale 2 removed `Task.empty()` since there's no Semigroup implementation anymore.

While there's no method that provides the same behaviour as `Task.empty()`, constructing a Task that never settles itself fulfills the same purpose:

{% highlight js %}
const task = require('folktale/concurrency/task');

const never = task((resolver) => {});
{% endhighlight %}


## Task.fold and Task.cata

Previously Task offerred two variants of catamorphism/pattern matching. The `Task.fold(onSuccess, onFailure)` and `Task.cata({ Resolved, Rejected })` methods had the same name as the ones in other structures, but very different behaviour:

{% highlight haskell %}
Either.fold :: (Either a b).((a) => c, (b) => c) => c
Either.cata :: (Either a b).({ Left: (a) => c, Right: (b) => c }) => c

Task.fold   :: (Task a b).((a) => Task c, (b) => Task c) => Task c
Task.cata   :: (Task a b).({ Rejected: (a) => Task c, Resolved: (b) => Task c }) => Task c
{% endhighlight %}

Folktale 2 removes both `fold` and `cata`, and provides a new method that signals this difference, called `willMatchWith`:

{% highlight js %}
const { of } = require('folktale/data/task');

of(1).willMatchWith({
  Cancelled: () => of('cancelled'),
  Resolved:  (value) => of(value + 1),
  Rejected:  (error) => of(error - 1)
});
// Task.of(2)
{% endhighlight %}


## Task.rejectedMap

With the standardisation of mapping method names, `Task.rejectedMap` is now `Task.mapRejected`. The behaviour is the same.

**Previously:**

{% highlight js %}
const Task = require('data.task');

Task.rejected(1).rejectedMap(x => x + 1);
// ==> Task.rejected(2)
{% endhighlight %}


**Now:**

{% highlight js %}
const { rejected } = require('folktale/concurrency/task');

rejected(1).mapRejected(x => x + 1);
// ==> rejected(2)
{% endhighlight %}


## Control.Async

The `Control.Async` library provided additional functions for combining and transforming Task objects. With Folktale 2, most of these have been moved in the Task module itself.


### memoise

Previously, one could use `memoise` to transform a pure task such that it only computed its value once, rather than every time it got executed.

{% highlight js %}
const Task = require('data.task');
const Async = require('control.async')(Task);

const two = Task.of(1).map(x => x + 1);
const lazyTwo = Async.memoise(two);

// Runs twice
two.fork(...); two.fork(...);

// Runs once
lazyTwo.fork(...); lazyTwo.fork(...);
{% endhighlight %}


With the new Task you get a `TaskExecution` object when you run the task. This execution object allows you to get the eventual value of a Task as a `Future` or a native `Promise`, which you can then hand off to parts of the code that only care about the result of a particular task execution.

{% highlight js %}
const { of } = require('folktale/concurrency/task');

const two = of(1).map(x => x + 1);
const lazyTwo = two.run().promise();

// Runs twice
two.run(); two.run();

// Only waits until the execution has finished
lazyTwo.then(...); lazyTwo.then(...);
{% endhighlight %}


## parallel

Previously it was possible to combine Tasks and run them in parallel by using the `parallel` combinator:

{% highlight js %}
const Task = require('data.task');
const Async = require('control.async')(Task);

Async.parallel(Task.of(1), Task.of(2)).chain(
  ([left, right]) => ...
);
{% endhighlight %}

Now the Task object provides a `.and()` method, which combines two tasks concurrently, and provides the result as a tuple:

{% highlight js %}
const { of } = require('folktale/concurrency/task');

of(1).and(of(2)).chain(
  ([left, right]) => ...
);
{% endhighlight %}

For combining more than two tasks, a `waitAll` function is also provided:

{% highlight js %}
const { of, waitAll } = require('folktale/concurrency/task');

waitAll([of(1), of(2), of(3)]).chain(
  ([a, b, c]) => ...
);
{% endhighlight %}


## nondeterministicChoice

Previously it was possible to choose between one of many tasks by using the `nondeterministicChoice` function, which would select the first task to complete:

{% highlight js %}
const Task = require('data.task');
const Async = require('control.async')(Task);

Async.nondeterministicChoice([Task.of(1), Task.of(2)]).chain(
  (firstValue) => ...
)
{% endhighlight %}


The new Task provides a `.or` method that combines two tasks in the same manner:

{% highlight js %}
const { of } = require('folktale/concurrency/task');

of(1).or(of(2)).chain(
  (firstValue) => ...
)
{% endhighlight %}

Combining more than two tasks may be done by `.or`-ing all of them together, or by using the `waitAny` function:

{% highlight js %}
const { of, waitAny } = require('folktale/concurrency/task');

waitAny([of(1), of(2), of(3)]).chain(
  (firstValue) => ...
)

// Equivalent to
of(1).or(of(2)).or(of(3)).chain(
  (firstValue) => ...
)
{% endhighlight %}


## tryAll

Previously the Control.Async library provided a `tryAll` function that selected the first *successful* task to complete. The new Task library still does not have an equivalent function to this one.


## catchOnly and catchAllPossibleErrors

Control.Async provided the `catchOnly` and `catchAllPossibleErrors` functions to trap errors thrown in synchronous tasks. Because these functions would not trap errors thrown asynchronously, their behaviour could be confusing. The new Task library does not provide an equivalent function, thus one must explicitly trap the errors themselves, and make sure that no asynchronous errors are thrown from their code.


## Converting from/to promises

Control.Async allowed converting from promises to tasks, with `fromPromise`, and from tasks to promises with `toPromise`.

{% highlight js %}
const Task = require('data.task');
const Async = require('control.async')(Task);

Async.fromPromise(Promise.resolve(1));

Async.toPromise(Task.of(1));
{% endhighlight %}

The new Task provides conversions to promises natively by way of the `TaskExecution` object.

{% highlight js %}
const { of } = require('folktale/concurrency/task');

of(1).run().promise();
{% endhighlight %}

It also provides a new `fromPromised` function, which allows one to convert a function that returns promises to a function that returns tasks. This is important to maintain the `always ran` semantics Tasks have:

{% highlight js %}
const { fromPromised } = require('folktale/concurrency/task');

const p = (x) => Promise.resolve(x);

fromPromised(p)(1);
// ==> task.of(1)
{% endhighlight %}


## Converting from/to nodebacks

Control.Async allowed converting from and to Nodebacks by using the `liftNode` and `toNode` functions.

{% highlight js %}
const Task = require('data.task');
const Async = require('control.async')(Task);
const fs = require('fs');

Async.liftNode(fs.readFile)('some-file.txt').fork(...);

Async.toNode(Task.of(1))((error, value) => {
  ...
});
{% endhighlight %}

The new Task library provides only a conversion from Nodebacks to tasks for now:

{% highlight js %}
const { fromNodeback } = require('folktale/concurrency/task');
const fs = require('fs');

fromNodeback(fs.readFile)('some-file.txt').run();
{% endhighlight %}


## delay and timeout

Control.Async had `delay` and `timeout` functions which allowed one to create a timer task.

{% highlight js %}
const Task = require('data.task');
const Async = require('contorl.async')(Task);

Async.delay(1000).fork(...);
Async.timeout(1000).fork(...);
{% endhighlight %}

These functions had quite a few problems (in particular with resource allocating when combined with other tasks). The new Task library does not provide any timing-related functions yet, but one could define these as follows:

{% highlight js %}
const { task } = require('folktale/concurrency/task');

function delay(ms) {
  return task((resolver) => {
    const timerId = setTimeout(() => resolver.resolve(), ms);
    resolver.cleanup(() => clearTimeout(timerId));
  });
}

function timeout(ms) {
  return task((resolver) => {
    const timerId = setTimeout(() => resolver.reject(), ms);
    resolver.cleanup(() => clearTimeout(timerId));
  });  
}
{% endhighlight %}
