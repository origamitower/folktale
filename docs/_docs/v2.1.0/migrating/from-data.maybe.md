---
title: …from Data.Maybe
prev_doc: v2.0.0/migrating/from-data.either
next_doc: v2.0.0/migrating/from-data.task
---

`Data.Maybe` provided a way of modelling computations that may provide a value or not. Folktale 2 keeps the same structure, but there're some changes in how you extract values out of Maybes and test them. You can look at the [full documentation for Maybe](/api/v2.0.0/en/folktale.maybe.html) for more detailed information.


## Contents
{:.no_toc}

* TOC
{:toc}


## Constructing

Constructing `Maybe` values remains the same, but the import changes.

**Previously:**

{% highlight js %}
const Maybe = require('data.maybe');

Maybe.Just(1);
Maybe.Nothing();
{% endhighlight %}


**Now:**

{% highlight js %}
const Maybe = require('folktale/maybe');

Maybe.Just(1);
Maybe.Nothing();
{% endhighlight %}


## Pattern matching

Previously it was possible to pattern match on a `Maybe` value by using the `.cata(patterns)` method. This method would take the value inside of the data structure and pass it on as positional arguments to the proper function:

{% highlight js %}
const Maybe = require('data.maybe');

Maybe.Just(1).cata({
  Just: (value) => value + 1,
  Nothing: () => 'nothing'
});
// ==> 2
{% endhighlight %}

Now, the preferred method in `Maybe` is `.matchWith(patterns)`, which works similarly, but passes an object with the fields instead of each value as positional argument:

{% highlight js %}
const Maybe = require('folktale/maybe');

Maybe.Just(1).matchWith({
  Just: (x) => x.value + 1,
  Nothing: () => 'nothing'
});
// ==> 2
{% endhighlight %}


## Testing instances

Previously, `Maybe` had `isJust` and `isNothing` boolean properties, which could be accessed to test whether a particular value was a `Just` or a `Nothing`:

{% highlight js %}
const Maybe = require('data.maybe');

const x = Maybe.Just(1);
const y = Maybe.Nothing();

x.isJust;     // ==> true
x.isNothing;  // ==> false

y.isJust;     // ==> false
y.isNothing;  // ==> true
{% endhighlight %}

Folktale 2 replaces these with a `.hasInstance(value)` function on the variant constructors and on the type. Variant testing can now be safely done with this function, including on values that may be `null` or `undefined`:

{% highlight js %}
const Maybe = require('folktale/maybe');

const x = Maybe.Just(1);
const y = Maybe.Nothing();

Maybe.Just.hasInstance(x);    // ==> true
Maybe.Just.hasInstance(y);    // ==> false

Maybe.Nothing.hasInstance(x); // ==> false
Maybe.Nothing.hasInstance(y); // ==> true
{% endhighlight %}

You can also test if a value is of a particular type by using the type's `.hasInstance` function:

{% highlight js %}
Maybe.hasInstance(x);     // ==> true
Maybe.hasInstance(y);     // ==> true
Maybe.hasInstance(null);  // ==> false
{% endhighlight %}


## Maybe.ap

The new `applicativeFn.apply(applicativeValue)` method is the recommended way of using applicative functors now, which is standardised across Folktale and independent of Fantasy-Land changes.

`.apply` and `.ap` still have the same semantics, but those semantics are different from the new `fantasy-land/ap` function! In order to write functions that are generic over different Fantasy-Land implementations and versions, the new [fantasy-land](/api/v2.0.0/en/folktale.fantasy-land.html) module should be used instead.


## Equality testing

Previously Maybe had a `.isEqual` method, which checked if two maybe values had the same tag and the same value (compared by reference):

{% highlight js %}
const Maybe = require('data.maybe');

Maybe.Just(1).isEqual(Maybe.Just(1));
// ==> true

Maybe.Just([1]).isEqual(Maybe.Just([1]));
// ==> false
{% endhighlight %}

Now, Maybe and other Folktale structures have a `.equals` method that does a similar test, but compares values *structurally* if they're [Fantasy-Land setoids](https://github.com/fantasyland/fantasy-land#setoid), arrays, or plain JavaScript objects:

{% highlight js %}
const Maybe = require('folktale/maybe');

Maybe.Just(1).equals(Maybe.Just(1));
// ==> true

Maybe.Just([1]).equals(Maybe.Just([1]));
// ==> true
{% endhighlight %}

More details can be found on the [Equality derivation](/api/v2.0.0/en/folktale.adt.union.derivations.equality.equality.html) documentation.


## Maybe.get

Previously, Maybe had a `.get()` method that would extract the value out of a *Just* structure, but throw an error if you had a *Nothing* structure:

{% highlight js %}
const Maybe = require('data.maybe');

Maybe.Just(1).get();    // ==> 1
Maybe.Nothing().get();  // ==> [Error: Can't extract the value of a Nothing]
{% endhighlight %}

This was unsafe, so in order to clearly signal that Folktale 2 has deprecated all `.get()` methods, and introduced a new `.unsafeGet()` one. You may use the new `.unsafeGet()` one if you really know what you're doing, but the method name now signals that you should be careful with it:

{% highlight js %}
const Maybe = require('folktale/maybe');

Maybe.Just(1).unsafeGet();    // ==> 1
Maybe.Nothing().unsafeGet();  // ==> [Error: Can't extract the value of a Nothing]
{% endhighlight %}

You're strongly encouraged to use the `.getOrElse(default)` method instead, which does not suffer from the same partiality problem:

{% highlight js %}
Maybe.Just(1).getOrElse(null);      // ==> 1
Maybe.Nothing().getOrElse(null);    // ==> null
{% endhighlight %}


## Maybe.fromEither

`Either` was replaced by `Result` in Folktale 2, and so the new method is `Maybe.fromResult`.

Please see the [Migrating from Data.Either]({% link _docs/v2.1.0/migrating/from-data.either.md %}) documentation if you have Either values in your code base.


## Maybe.toJSON and Maybe.fromJSON

There was some experimental support in the old `Maybe` structure for serialisation to and parsing from JSON structures:

{% highlight js %}
const Maybe = require('data.maybe');

Maybe.Just(1).toJSON();

const Enc = require('encoding.json');
const MaybeEnc = require('data.maybe/encoding')(Enc);

MaybeEnc.fromJSON(Maybe.Just(1).toJSON());
{% endhighlight %}

The new Folktale has a more standardised (and general) way of serialising and parsing its algebraic data structures, so each structure provides its own `.toJSON()` and `.fromJSON()`:

{% highlight js %}
const Maybe = require('data.maybe');
Maybe.Just(1).toJSON();
Maybe.fromJSON(Maybe.Just(1).toJSON());
{% endhighlight %}

More details can be found on the [Serialization derivation](/api/v2.0.0/en/folktale.adt.union.derivations.serialization.serialization.html) documentation.
