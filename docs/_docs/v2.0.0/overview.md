---
title: Overview
prev_doc: v2.0.0/download
next_doc: v2.0.0/changelog
---

Folktale is a library to support a functional style of programming in JavaScript.
In its current version Folktale provides utilities for [combining functions](/api/v2.0.0/en/folktale.core.lambda.html),
[transforming objects](/api/v2.0.0/en/folktale.core.object.html), [modelling data](/api/v2.0.0/en/folktale.adt.html), [handling errors](/api/v2.0.0/en/folktale.html#cat-handling-failures), and [concurrency](/api/v2.0.0/en/folktale.concurrency.task.html).

The [API reference](/api/v2.0.0/en/folktale.html) provides detailed documentation
on these, but may be difficult to navigate. This page serves as an introduction to
the most important concepts.


## Contents
{:.no_toc}

* TOC
{:toc}


## Folktale and Functional Programming

The goal of Folktale is to be a fully-featured standard library that supports a functional
style of programming in JavaScript and TypeScript. In this style, functionality is broken
down in small and focused functions, and more complex functionality is created by combining
these functions. Functional Programming makes these pieces easier to combine by avoiding
accidental complexities, such as [overloading polymorphism][] and [side-effects][].

Other characteristics from the functional style of programming are stricter definitions
of data structures to simplify transforming them and aid correctness; and the use of
*pure* structures. That is, instead of changing a structure in memory, an entire new
structure is created for every change.

To do this efficiently, one needs special implementations of data structures, and new
ways to construct them. Folktale's goals is to help you achieve this.


[overloading polymorphism]: https://www.quora.com/Object-Oriented-Programming-What-is-a-concise-definition-of-polymorphism/answer/Quildreen-Motta
[side-effects]: https://en.wikipedia.org/wiki/Side_effect_(computer_science).


## Programming with functions

Core to functional programming is the idea of programming with functions (in the more mathematical
sense of the word). The concept is fairly broad, and most of the things encompassed by it can be
achieved with some work in ECMAScript.

For example, sometimes it's important to evaluate an expression eagerly when using higher-order
functions (such as `Array.map`), because otherwise the expression could be evaluated more than
once. This happens in particular where side-effects are concerned:

{% highlight js %}
const counter = {
  current: 0,
  next() {
    return ++this.current;
  }
};

// `counter.next()` is evaluated for every item in the array
['a', 'b', 'c'].map(x => counter.next());
// ==> [1, 2, 3]
{% endhighlight %}

In order to evaluate it only once, we'd need to evaluate the expression and store its value
in some variable:

{% highlight js %}
const value = counter.next();
['a', 'b', 'c'].map(x => value);
// ==> [4, 4, 4]
{% endhighlight %}

Another option is using a functional combinator like [constant](/api/v2.0.0/en/folktale.core.lambda.constant.constant.html):

{% highlight js %}
const constant = require('folktale/core/lambda/constant');

['a', 'b', 'c'].map(constant(counter.next()));
// ==> [5, 5, 5]
{% endhighlight %}

Folktale's [`core/lambda`](/api/v2.0.0/en/folktale.core.lambda.html) module tries to provide
these small utilities that help combining and transforming functions in a program. See the
module's documentation for more details.


## Handling errors

There are a few ways in which errors are generally handled in JavaScript, but they tend to
boil down mostly to control-flow structures (`if/else`) or exceptions (`try/catch`). These
tend to either be hard to predict or hard to maintain. Foltkale provides three data
structures to help with error handling:

  - [Maybe](/api/v2.0.0/en/folktale.maybe.html) - A structure that helps handling values
    that may or may not be present. For example, a function like `Array.find` may or may
    not be able to return a value. People tend to use `null` as a return value when the
    function fails to return one, but that's ambiguous if the original array had a `null`
    value. Maybe allows one to deal with these cases without ambiguity, and forces errors
    to be handled.

    {% highlight js %}
    const Maybe = require('folktale/maybe');

    function find(xs, predicate) {
      for (const x of xs) {
        if (predicate(x))  return Maybe.Just(x);
      }

      return Maybe.Nothing();
    }

    find([null, 1], x => true);  // ==> Maybe.Just(null)
    find([null, 1], x => false); // ==> Maybe.Nothing()
    {% endhighlight %}

  - [Result](/api/v2.0.0/en/folktale.result.html) - A structure that models the result
    of functions that may fail. For example, parsing a JSON string into native objects
    doesn't always succeed, but it may fail for different reasons: the JSON string could
    be malformed, the reifying function could throw an error, etc. Ideally we'd capture
    this additional information so the person receiving the result of the parsing could
    deal with the failure in an appropriate manner. Result lets you do this safely.

    {% highlight js %}
    const Result = require('folktale/result');

    class DivisionByZero extends Error {
      get name() { return "DivisionByZero" }
    }

    class IllegalArgument extends Error {
      get name() { return "IllegalArgument" }
    }

    function divide(x, y) {
      if (typeof x !== "number" || typeof y !== "number") {
        return Result.Error(new IllegalArgument(`arguments to divide must be numbers`));
      } else if (y === 0) {
        return Result.Error(new DivisionByZero(`${x} / ${y} is not computable.`));
      } else {
        return Result.Ok(x / y);
      }
    }

    divide(4, 2); // ==> Result.Ok(2)
    divide(2, 0); // ==> Result.Error([DivisionByZero: 2 / 0 is not computable])
    {% endhighlight %}

  - [Validation](/api/v2.0.0/en/folktale.validation.html) - A structure that helps with
    validations (such as form validations). A validation function may succeed or fail,
    like the functions mentioned above, but unlike the cases where Result is indicated,
    when doing validations one generally wants to capture *all* of the failures and
    display them back to the user. Validation works similarly to Result, but provides
    methods that help aggregating all failures, rather than stopping at the first one.


## Modelling data

Another core part of functional programming is modelling data. Properly modelling
what you can and can't do with a data structure helps writing correct programs,
but JavaScript has very few tools for this. Folktale lessens this by adding 
experimental support for tagged unions, which are used to model possibilities in a particular
type of data.

Think of tagged unions as a beefed-up enum structure. For example, a binary
tree can be seen as a type with the possibilities: "a branch node" or "a
leaf node":

{% highlight js %}
const { union } = require('folktale/adt/union');

const Tree = union('Tree', {
  Leaf(value){
    return { value };
  },
  Branch(left, right) {
    return { left, right };
  }
});
{% endhighlight %}

Folktale allows you to use a limited form of pattern matching to operate
on these structures:

{% highlight js %}
Tree.sum = function() {
  return this.matchWith({
    Leaf: ({ value }) => value,
    Branch: ({ left, right }) => left.sum() + right.sum()
  });
};

Branch(
  Leaf(1), 
  Branch(Leaf(2), Leaf(3))
).sum();
// ==> 6

Tree.invert = function() {
  return this.matchWith({
    Leaf: ({ value })         => Leaf(value),
    Branch: ({ left, right }) => Branch(right.invert(), left.invert())
  });
};

Branch(
  Leaf(1),
  Leaf(2)
).invert();
// ==> Branch(Leaf(2), Leaf(1))
{% endhighlight %}


More documentation can be found in the [`adt/union`](/api/v2.0.0/en/folktale.adt.union.html)
module reference.


## Concurrency

JavaScript has added better support to concurrency recently with Promises and `async/await`,
but Promises work at the value level, so they can't help with actions and their composition.
For example, if one sends an HTTP request, they may want to cancel it if it takes too long,
or they may send two HTTP requests, take the first that returns, and cancel the other one.
None of this is supported by Promises, but they're supported by Folktale's experimental Task.

A Task is a structure that models asynchronous actions, including their resource management
and cancellation. This means that, if a Task is cancelled before it finishes executing, any
resources it allocated will be properly disposed of. Even when combined with other tasks,
or transformed by other functions.

The documentation for the [`concurrency/task`](/api/v2.0.0/en/folktale.concurrency.task.html)
module describes this in details.
