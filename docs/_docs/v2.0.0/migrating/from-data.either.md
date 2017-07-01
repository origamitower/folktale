---
title: …from Data.Either
prev_doc: v2.0.0/migrating/from-core.lambda
next_doc: v2.0.0/migrating/from-data.maybe
---

`Data.Either` provided a disjunction to model the result of functions that could fail. Folktale 2 has changed a few things around and this data structure is now called `Result`, with `Ok` and `Error` as its variant tags. This page explains how to migrate from the old `Data.Either` to the new `Result` object. You can look at the [full documentation for Result](/api/v2.0.0/en/folktale.result.html) for more detailed information.


## Contents
{:.no_toc}

* TOC
{:toc}


## Constructing

Constructing values of `Either` was done previously as:

{% highlight js %}
const Either = require('data.either');

Either.Left(1);
Either.Right(2);
{% endhighlight %}

With `Result`, this is now done as follows:

{% highlight js %}
const Result = require('folktale/result');

Result.Error(1);
Result.Ok(2);
{% endhighlight %}

So, the type name is now `Result`. The `Left` constructor is now `Error`, to better indicate that it's used for representing failures. The `Right` constructor is now `Ok`, to better indicate that it's used for representing successes.


## Pattern matching

Previously, it was possible to pattern match on an `Either` value by using `.cata(patterns)`. This method would take the value inside of the data structure and pass it as a positional argument to the proper function:

{% highlight js %}
const Either = require('data.either');

Either.Left(1).cata({
  Left:  (value) => value + 1,
  Right: (value) => value - 1
});
// ==> 2
{% endhighlight %}

Now, the preferred method in `Result` is `.matchWith(patterns)`, which works similarly, but passes an object with the fields instead of each value as a positional argument:

{% highlight js %}
const Result = require('folktale/result');

Result.Error(1).matchWith({
  Error: (x) => x.value + 1,
  Ok:    (x) => x.value - 1
});
// ==> 2
{% endhighlight %}


## Testing instances

Previously, `Either` had `isLeft` and `isRight` boolean properties, which could be accessed to test whether a particular value was a `Left` or a `Right`:

{% highlight js %}
const Either = require('data.either');

const x = Either.Left(1);
const y = Either.Right(2);

x.isLeft;  // ==> true
x.isRight; // ==> false

y.isLeft;  // ==> false
y.isRight; // ==> true
{% endhighlight %}

Folktale 2 replaces these with a `.hasInstance(value)` function on the variant constructors and on the type. Variant testing can now be safely done with this function, including on values that may be `null` or `undefined`:

{% highlight js %}
const Result = require('folktale/result');

const x = Result.Error(1);
const y = Result.Ok(2);

Result.Error.hasInstance(x); // ==> true
Result.Error.hasInstance(y); // ==> false

Result.Ok.hasInstance(x); // ==> false
Result.Ok.hasInstance(y); // ==> true
{% endhighlight %}

You can also test if a value is of a particular type by using the type's `.hasInstance` function:

{% highlight js %}
Result.hasInstance(x);    // ==> true
Result.hasInstance(y);    // ==> true
Result.hasInstance(null); // ==> false
{% endhighlight %}


## Either.try

Previously, `Either.try(f)` could be used to transform a function that throws errors into a function that returns an `Either` type:

{% highlight js %}
function divide(x, y) {
  if (y === 0) {
    throw new Error('division by zero');
  } else {
    return x / y;
  }
}
{% endhighlight %}

{% highlight js %}
const Either = require('data.either');

const safeDivide = Either.try(divide);
safeDivide(4, 2); // ==> Either.Right(2)
safeDivide(4, 0); // ==> Either.Left([Error: division by zero])
{% endhighlight %}

The new `try` function takes a thunk instead, and executes it right away:

{% highlight js %}
const Result = require('folktale/result');

Result.try(_ => divide(4, 2)); // ==> Result.Ok(2)
Result.try(_ => divide(4, 0)); // ==> Result.Error([Error: division by zero])
{% endhighlight %}

You'd have to construct a safe version of a function explicitly:

{% highlight js %}
const safeDivide = (x, y) => Result.try(divide(x, y));

safeDivide(4, 2); // ==> Result.Ok(2)
safeDivide(4, 0); // ==> Result.Error([Error: division by zero])
{% endhighlight %}


## Either.ap

The new `applicativeFn.apply(applicativeValue)` method is the recommended way of using applicative functors now, which is standardised across Folktale and independent of Fantasy-Land changes.

`.apply` and `.ap` still have the same semantics, but those semantics are different from the new `fantasy-land/ap` function! In order to write functions that are generic over different Fantasy-Land implementations and versions, the new [fantasy-land](/api/v2.0.0/en/folktale.fantasy-land.html) module should be used instead.


## Equality testing

Previously Either had a `.isEqual` method, which checked if two either values had the same tag and the same value (compared by reference):

{% highlight js %}
const Either = require('data.either');

Either.Left(1).isEqual(Either.Left(1));
// ==> true

Either.Right([1]).isEqual(Either.Right([1]));
// ==> false
{% endhighlight %}

Now, Result and other Folktale structures have a `.equals` method that does a similar test, but compares values *structurally* if they're [Fantasy-Land setoids](https://github.com/fantasyland/fantasy-land#setoid), arrays, or plain JavaScript objects:

{% highlight js %}
const Result = require('folktale/result');

Result.Error(1).equals(Result.Error(1));
// ==> true

Result.Ok([1]).equals(Result.Ok([1]));
// ==> true
{% endhighlight %}

More details can be found on the [Equality derivation](/api/v2.0.0/en/folktale.adt.union.derivations.equality.equality.html) documentation.


## Either.get

Previously, Either had a `.get()` method that would extract the value out of a *Right* structure, but throw an error if you had a *Left* structure:

{% highlight js %}
const Either = require('data.either');

Either.Left(1).get();  // ==> [Error: Can't extract the value of a Left(a)]
Either.Right(1).get(); // ==> 1
{% endhighlight %}

This was unsafe, so in order to clearly signal that Folktale 2 has deprecated all `.get()` methods, and introduced a new `.unsafeGet()` one. You may use the new `.unsafeGet()` one if you really know what you're doing, but the method name now signals that you should be careful with it:

{% highlight js %}
const Result = require('folktale/result');

Result.Ok(1).unsafeGet();    // ==> 1
Result.Error(1).unsafeGet(); // ==> [Error: Can't extract the value of an Error]
{% endhighlight %}

You're strongly encouraged to use the `.getOrElse(default)` method instead, which does not suffer from the same partiality problem:

{% highlight js %}
Result.Ok(1).getOrElse(null);    // ==> 1
Result.Error(1).getOrElse(null); // ==> null
{% endhighlight %}


## Either.leftMap

Previously, Either had a `.leftMap(f)` method, which worked like `.map(f)` for *Left* values:

{% highlight js %}
const Either = require('data.either');

Either.Left(1).leftMap(x => x + 1);
// ==> Either.Left(2)
{% endhighlight %}

This was a mess, with each structure naming that method in a different way. Folktale 2 standardises these as `map{Tag}` instead. So Result gets a `.mapError(f)`:

{% highlight js %}
const Result = require('folktale/result');

Result.Error(1).mapError(x => x + 1);
// ==> Result.Error(2)
{% endhighlight %}
