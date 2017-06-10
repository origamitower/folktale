---
title: …from Data.Validation
prev_doc: v2.0.0/migrating/from-data.task
next_doc: v2.0.0/migrating/from-early-v2.0.0
---

`Data.Validation` provided a way of modelling composable validations. Folktale 2 keeps the same structure and semantics, but there's some hcanges in how you extract values out of Validations and test them. You can look at the [full documentation for Validation](/api/v2.0.0/en/folktale.validation.html) for more detailed information.


## Contents
{:.no_toc}

* TOC
{:toc}


## Constructing

Constructing `Validation` values remains the same, but the import changes.

**Previously:**

{% highlight js %}
const Validation = require('data.validation');

Validation.Success(1);
Validation.Failure(2);
{% endhighlight %}

**Now:**

{% highlight js %}
const Validation = require('folktale/validation');

Validation.Success(1);
Validation.Failure(2);
{% endhighlight %}


## Pattern matching

Previously it was possible to pattern match on a `Validation` value by using the `.cata(patterns)` method. This method would take the value inside of the data structure and pass it on as positional arguments to the proper function:

{% highlight js %}
const Validation = require('data.validation');

Validation.Success(1).cata({
  Success: (value) => value + 1,
  Failure: (value) => value - 1
});
// ==> 2
{% endhighlight %}

Now, the preferred method in `Validation` is `.matchWith(patterns)`, which works similarly, but passes an object with the fields instead of each value as positional argument:

{% highlight js %}
const Validation = require('folktale/validation');

Validation.Success(1).matchWith({
  Success: (x) => x.value + 1,
  Failure: (x) => x.value - 1
});
// ==> 2
{% endhighlight %}


## Testing instances

Previously, `Validation` had `isSuccess` and `isFailure` boolean properties, which could be accessed to test whether a particular value was a `Success` or a `Failure`:

{% highlight js %}
const Validation = require('data.validation');

const x = Validation.Success(1);
const y = Validation.Failure(1);

x.isSuccess;      // ==> true
x.isFailure;      // ==> false

y.isSuccess;      // ==> false
y.isFailure;      // ==> true
{% endhighlight %}


Folktale 2 replaces these with a `.hasInstance(value)` function on the variant constructors and on the type. Variant testing can now be safely done with this function, including on values that may be `null` or `undefined`:


## Validation.ap

The new `applicativeFn.apply(applicativeValue)` method is the recommended way of using applicative functors now, which is standardised across Folktale and independent of Fantasy-Land changes.

`.apply` and `.ap` still have the same semantics, but those semantics are different from the new `fantasy-land/ap` function! In order to write functions that are generic over different Fantasy-Land implementations and versions, the new [fantasy-land](/api/v2.0.0/en/folktale.fantasy-land.html) module should be used instead.


## Equality testing

Previously validation had a `.isEqual` method, which checked if two validation values had the same tag and the same value (compared by reference):

{% highlight js %}
const Validation = require('data.validation');

Validation.Success(1).isEqual(Validation.Success(1));
// ==> true

Validation.Success([1]).isEqual(Validation.Success([1]));
// ==> false
{% endhighlight %}


Now, Validation and other Folktale structures have a `.equals` method that does a similar test, but compares values *structurally* if they're [Fantasy-Land setoids](https://github.com/fantasyland/fantasy-land#setoid), arrays, or plain JavaScript objects:

{% highlight js %}
const Validation = require('folktale/validation');

Validation.Success(1).equals(Validation.Success(1));
// ==> true

Validation.Success([1]).equals(Validation.Success([1]));
// ==> true
{% endhighlight %}


More details can be found on the [Equality derivation](/api/v2.0.0/en/folktale.adt.union.derivations.equality.equality.html) documentation.


## Validation.get

Previously, Validation had a `.get()` method that would extract the value of a *Success* structure, but throw an error if you had a *Failure* structure:

{% highlight js %}
const Validation = require('data.validation');

Validation.Success(1).get();    // ==> 1
Validation.Failure(1).get();    // ==> [Error: Can't extract the value of a Failure]
{% endhighlight %}

This was unsafe, so in order to clearly signal that Folktale 2 has deprecated all `.get()` m ethods, and introduced a new `.unsafeGet()` one. You may use the new `.unsafeGet()` one if you really know what you're doing, but the method name now signals that you should be careful with it:

{% highlight js %}
const Validation = require('folktale/validation');

Validation.Success(1).unsafeGet();    // ==> 1
Validation.Failure(1).unsafeGet();    // ==> [Error: Can't extract the value of a Failure]
{% endhighlight %}

You're strongly encouraged to use the `.getOrElse(default)` method instead, which does not suffer from the same partiality problem:

{% highlight js %}
Validation.Success(1).getOrElse(null);    // ==> 1
Validation.Failure(1).getOrElse(null);    // ==> null
{% endhighlight %}


## Validation.fromEither

`Either` was replaced by `Result` in Folktale 2, and so the new method is `Validation.fromResult`.

Please see the [Migrating from Data.Either]({% link _docs/v2.0.0/migrating/from-data.either.md %}) documentation if you have Either values in your code base.


## Validation.failureMap

Previously, Validation had a `.failureMap(f)` method, which worked like `.map(f)` for *Failure* values:

{% highlight js %}
const Validation = require('data.validation');

Validation.Failure(1).failureMap(x => x + 1);
// ==> Validation.Failure(2)
{% endhighlight %}

This was a mess, with each structure naming that method in a different way. Folktale 2 standardises these as `map{Tag}` instead. So Validation gets a `.mapFailure(f)`:

{% highlight js %}
const Validation = require('folktale/validation');

Validation.Failure(1).mapFailure(x => x + 1);
// ==> Validation.Failure(2)
{% endhighlight %}