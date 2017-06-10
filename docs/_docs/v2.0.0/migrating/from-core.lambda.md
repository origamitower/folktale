---
title: …from Core.Lambda
prev_doc: v2.0.0/migrating/from-core.arity
next_doc: v2.0.0/migrating/from-data.either
---

`Core.Lambda` provided basic operations to combine and transform functions. Most of the important ones are still available in Folktale 2, but under a different module. This page provides migration instructions for each function in `Core.Lambda`. You can look at the [full documentation for `core/lambda`](/api/v2.0.0/en/folktale.core.lambda.html) for more detailed information.


## Contents
{:.no_toc}

* TOC
{:toc}


## identity(x)

The `identity` function remains the same in Folktale, so the only change required is changing the import expression for it.

**Previously:**

{% highlight js %}
const { identity } = require('core.lambda');
{% endhighlight %}

**Now:**

{% highlight js %}
const { identity } = require('folktale/core/lambda');

// Or importing only the identity function:
const identity = require('folktale/core/lambda/identity');
{% endhighlight %}


## constant(x)(_)

Folktale 2 provides a simpler form of `constant`, which does no unrolling. If you're not passing 2 arguments to `constant`, the only thing you need to do is change your import.

**Previously:**

{% highlight js %}
const { constant } = require('core.lambda');

const one = constant(1);
{% endhighlight %}

**Now:**

{% highlight js %}
const { constant } = require('folktale/core/lambda');

const one = constant(1);

// You can also load just the `constant` function:
const constant = require('folktale/core/lambda/constant');
{% endhighlight %}


If you're relying on the unrolling behaviour, see [`curry(arity, f)`](#curry).


## apply(f, x)

There's no equivalent of `apply` in the Folktale 2. `apply` is generally the same as just referring to the function directly:

{% highlight js %}
function inc(x){
  return x + 1;
}


const { apply } = require('core.lambda');

const f = apply(inc);

// Same as:
const f = inc;
{% endhighlight %}


## flip(f)(b)(a)

There's no equivalent of `flip` in Folktale 2. Instead you should create a new function that changes the ordering of the parameters using an arrow function.

**Previously:**

{% highlight js %}
function subtract(x, y) {
  return x - y;
}

const { flip } = require('core.lambda');
const { unary } = require('core.arity');

[1, 2, 3].map(unary(flip(subtract)(1)));
// ==> [0, 1, 2]
{% endhighlight %}

**Now:**

{% highlight js %}
[1, 2, 3].map(x => subtract(x, 1));
// ==> [0, 1, 2]
{% endhighlight %}


## compose(f, g)(x)

Folktale 2 provides a `compose` function without the unrolling semantics. See [the `compose` documentation](/api/v2.0.0/en/folktale.core.lambda.compose.compose.html) for details.

If you're using `compose` in the form `compose(f, g)(x)`, then you only need to change your imports:

{% highlight js %}
const inc    = (x) => x + 1;
const double = (x) => x * 2;
{% endhighlight %}

**Previously:**

{% highlight js %}
const { compose } = require('core.lambda');
const incDouble = compose(double, inc);
incDouble(3);
// ==> 8
{% endhighlight %}

**Now:**

{% highlight js %}
const { compose } = require('folktale/core/lambda');
const incDouble = compose(double, inc);
incDouble(3);
// ==> 8
{% endhighlight %}


If you're using a single saturated call, you can either simplify the expression, or pass the argument as a separate call.

**Previously:**

{% highlight js %}
const { compose } = require('core.lambda');
compose(double, inc, 3);
// ==> 8
{% endhighlight %}

**Now:**

{% highlight js %}
const { compose } = require('folktale/core/lambda');
double(inc(3));
// ==> 8

compose(double, inc)(3);
// ==> 8
{% endhighlight %}


If you're specifying just one of the functions to compose, or some other uncommon partial application, create a new function explicitly instead.

**Previously:**

{% highlight js %}
const { compose } = require('core.lambda');
const thenDouble = compose(double);
thenDouble(inc)(3);
// ==> 8
{% endhighlight %}

**Now:**

{% highlight js %}
const { compose } = require('folktale/core/lambda');
const thenDouble = (f, x) => double(f(x));
thenDouble(inc)(3);
// ==> 8
{% endhighlight %}


## curry(arity, f)  {#curry}

Folktale 2 provides a `curry` function that's very similar to the old one, with the difference that it'll only unroll up to the provided arity. This avoids problems with Folktale trying to unroll application of non-curried function when interacting with variadic functions in JavaScript (for example, with `Array#map`). See [the `curry` documentation](/api/v2.0.0/en/folktale.core.lambda.curry.curry.html) for details.

The only thing you need to do is changing your imports.

{% highlight js %}
function add(a, b) {
  return a + b;
}
{% endhighlight %}

**Previously:**

{% highlight js %}
const { curry } = require('core.lambda');
curry(2, add)(1)(2);
// ==> 3
{% endhighlight %}

**Now:**

{% highlight js %}
const { curry } = require('folktale/core/lambda');
curry(2, add)(1, 2);
// ==> 3
{% endhighlight %}


## spread(f, args)

Folktale 2 does not provide a `spread` equivalent. You can use an arrow function instead to apply an array as positional arguments.

**Previously:**

{% highlight js %}
const { spread } = require('core.lambda');

xs.map(spread(someFunction));
{% endhighlight %}

**Now:**

{% highlight js %}
xs.map(x => someFunction(...x));
{% endhighlight %}


## uncurry(f)

Folktale 2 does not provide an `uncurry` equivalent, since curried functions are avoided through the library. In any case, `uncurry` is not necessary for functions curried with the `curry` operation, which already does unrolling.

**Previously:**

{% highlight js %}
const { curry, uncurry } = require('core.lambda');

const add = curry(3, (x, y, z) => x + y + z);
uncurry(add)(1, 2, 3);
// ==> 6
{% endhighlight %}

**Now:**

{% highlight js %}
const { curry } = require('folktale/core/lambda');

const add = curry(3, (x, y, z) => x + y + z);
add(1, 2, 3);
// ==> 6
{% endhighlight %}


## upon(f, g)(a, b)

There's no equivalent of `upon` in Folktale 2, use an arrow function.

{% highlight js %}
function sort(xs, f) {
  return xs.sort(f);
}

function compare(x, y) {
  return x < y ?    -1
  :      x > y ?     1
  :      /* else */  0;
}

function first(xs) {
  return xs[0];
} 
{% endhighlight %}

**Previously:**

{% highlight js %}
const { upon } = require('core.lambda');
const { binary } = require('core.arity');

sort([[1, 2], [3, 1], [-2, 4]], upon(compare, first));
// ==> [[-2, 4], [1, 2], [3, 1]]
{% endhighlight %}

**Now:**

{% highlight js %}
sort([[1, 2], [3, 1], [-2, 4]], (x, y) => compare(first(x), first(y)));
// ==> [[-2, 4], [1, 2], [3, 1]]
{% endhighlight %}
