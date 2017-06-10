---
title: Frequently Asked Questions
group: support
prev_doc: support
next_doc: support/bugs
---

This document provides answers to some common questions people have when using Folktale.

## Contents
{:.no_toc}

* TOC
{:toc}


## Common mistakes

### Why do I get an error saying "`.apply` is not a function"?

> **Short answer**
> Folktale unrolls application of curried functions, so if you pass more arguments than what a function takes, that function might try passing some of those arguments to its return value.
{:.note}

JavaScript makes heavy use of variadic functions (functions that may receive a varying number of arguments, rather than a fixed one). Meanwhile, functional programming makes heavy use of a technique called [currying](http://origamitower.github.io/folktale/api/en/folktale.src.core.lambda.curry.curry.html#what-is-currying-). These two are largely incompatible, as currying relies on functions taking exactly one argument, and returning either the result of the computation (all dependencies have been gathered), or a new curried function to gather more arguments.

Both Folktale 1 and Folktale 2 use currying in its functions. Due to the problems with variadic functions, currying is avoided by default in Folktale 2, but you may still run into them. The core of the issue lies within the effort Folktale makes to allow composing curried functions arbitrarily, through *unrolling* function application. This is done so curried functions may interact seamlessly with JavaScript's regular functions that may know nothing about currying:

{% highlight js %}
// math3 takes exactly 3 arguments, 1 at a time
const math3 = curry(3, (a, b, c) => a - b + c);

math3(4)(2)(1); // ==> 3

// flip knows nothing about currying (it passes more than one argument)
const flip = (f) => (a, b) => f(b, a);

flip(math3(4))(1, 2); // ==> math3(4)(2, 1)
{% endhighlight %}

Now, if Folktale forced curried functions to take exactly one argument at a time, then `math3(4)(2, 1)` would ignore the second argument, and thus instead of the expected result, `3`, you'd get back a function that expects one more argument. This is awkward in JavaScript, so instead Folktale's curry creates functions that *unroll* their application. That is:

{% highlight js %}
    math3(4, 2, 1)
=== math3(4, 2)(1) or math3(4)(2, 1)
=== math3(4)(2)(1)
{% endhighlight %}

It takes those many arguments and applies them one by one, until they're all passed to the functions your curried one may return. The [new docs have a more detailed description of how this works](http://origamitower.github.io/folktale/api/en/folktale.src.core.lambda.curry.curry.html#-curry-under-the-hood). This means that our `flip(maths(4))(1, 2)` works, even though `flip` was not written for curried functions. That's great.

But what happens when we provide more arguments than what a curried function can take? Well, it depends. If you're using Folktale 1's `core.lambda/curry`, then those additional arguments are passed down to the resulting function regardless:

{% highlight js %}
flip(math3(4))(1, 2)
// ==> math3(4)(2, 1)
// ==> math3(4)(2)(1) 
// ==> 3

flip(math3(4, 2))(1, 3)
// ==> math3(4, 2)(1, 3) 
// ==> math3(4)(2)(1)(3) 
// ==> 3(3) 
// ==> TypeError: (3).apply(...) is not a function
{% endhighlight %}

That's… not great. This happens quite often in JavaScript because most functions are variadic, so JavaScript APIs just pass a bunch of arguments that your function can ignore by simply not declaring them in its signature. `Array#map` is a good example:

{% highlight js %}
[1, 2, 3].map((element, index, array) => element + 1);
// ==> [2, 3, 4]

// This is also fine:
[1, 2, 3].map((element) => element + 1);
// ==> [2, 3, 4]
{% endhighlight %}

`.map` is still passing 3 arguments to the second function, so the number of arguments passed is still 3 even if the function declares no intention of accessing the other 2. Folktale 2 mitigates this a bit. The application is only unrolled if the resulting function has been marked as a Folktale curried function. This way:

{% highlight js %}
flip(math3(4))(1, 2)
// ==> math3(4)(2, 1)
// ==> math3(4)(2)(1) 
// ==> 3

flip(math3(4, 2))(1, 3)
// ==> math3(4, 2)(1, 3) 
// ==> math3(4)(2)(1) ^-- ignored as 3 is not a Folktale curried fn
// ==> 3 
{% endhighlight %}



### Why is there no `.chain` for Validation?

> **Short answer**
> The way Validation's `.ap` method works makes it impossible to implement the [Monad](https://github.com/fantasyland/fantasy-land#monad) interface (`.chain`). You might either want to use Either/Result, or rethink how you're approaching the problem.
{:.note}

Validation and Either/Result are very similar types, but while Either/Result have `.chain` and `.ap`, Validation only has `.ap`. This confuses people expecting to use Validation to *sequence* things that may fail.

  - **Validation**: A data structure for *aggregating* errors;
  - **Result/Either**: A data structure for representing results of computations and *sequencing* them;

The [new documentation explains these similarities and differences](http://origamitower.github.io/folktale/api/en/folktale.src.data.result.html#how-does-result-compare-to-validation-) very concisely, and likens the Either/Result + `.chain` to JavaScript's exceptions and the `;` operator. Either/Result, Future, and Task all have Monad implementations that could be understood in terms of `;`. That is, a regular code like `var x = doX(); doY()` would be equivalent to `doX().chain((x) => doY())` if using the [Monad][] implementation of those data structures.

Validation is a bit different. It's not designed to *sequence* computations like that, but to *aggregate* failures. A common use case is validating a form submission or checking if a data structure matches a schema. In those cases you don't really check the first field, and then move to checking the next one only if the first one succeeds. The checks are largely independent, so you just check all of them separately, then combine them, so you can get all of the ones that have failed.

The way Validation combines these independent checks is through its [Applicative][] implementation, or the `.ap` method. It works like this:

    Success(x) ap Success(y) => Success(x(y))
    Failure(x) ap Success(y) => Failure(x)
    Success(x) ap Failure(y) => Failure(y)
    Failure(x) ap Failure(y) => Failure(x + y)

Out of these four cases, the last one is the interesting one. If we have two Failures, and we apply them together, we get a new Failure that is the combination of both of their values (we combine them through the `.concat` method!). That is, if we have the following code:

{% highlight js %}
Failure('hello').ap(Failure(', ')).ap(Failure('world!'));
{% endhighlight %}

We get:

{% highlight js %}
Failure('hello'.concat(', ').concat('world!'));
{% endhighlight %}

This is in line with the goal of combining all of the errors (as in the form validation example), but how exactly does this prevent Validation from having a `.chain` method? It's more that Validation can't *implement* [Monad][] than it being unable to have a `.chain` method, but it so happens that in Fantasy Land, adding a `.chain` method when you have a `.of` method is considered an implementation of [Monad][]. And if you implement [Monad][], turns out your methods have to satisfy some requirements (so people can write generic code that doesn't behave weirdly here and there). The requirement that matters here is this one:

{% highlight js %}
V1.map(x => y => [x, y]).ap(V2) = V1.chain(x => V2.map(y => [x, y]));
{% endhighlight %}

So, if you implement [Monad][] and [Applicative][], then the code on the left has to be equivalent (i.e.: do the same thing) as the code on the right. If we were to implement `.chain` for Validation, it would look like this:

    Success(x) chain f => f(x)        -- `f` has to return a Validation
    Failure(x) chain f => Failure(x)

Quite simple, right? But remember our definition of `.ap`? Let's compare some results and see why these aren't equivalent:

{% highlight js %}
Success('1').chain(x => Success('2').map(y => x + y))        // ==> Success('12')
Success(x => y => x + y).ap(Success('1')).ap(Success('2'))   // ==> Success('12')

Success('1').chain(x => Failure('2').map(y => x + y))        // ==> Failure('2')
Success(x => y => x + y).ap(Success('1')).ap(Failure('2'))   // ==> Failure('2')

Failure('1').chain(x => Success('2').map(y => x + y))        // ==> Failure('1')
Success(x => y => x + y).ap(Failure('1')).ap(Success('2'))   // ==> Failure('1')

Failure('1').chain(x => Failure('2').map(y => x + y))        // ==> Failure('1')
Success(x => y => x + y).ap(Failure('1')).ap(Failure('2'))   // ==> Failure('12')
{% endhighlight %}

Oops. The last case doesn't behave quite the same. Since the `.chain` method can't execute the function to get the other Failure, the only thing it can do is return the Failure it's got. Meanwhile, `.ap` can compare both values and decide how to combine them. But this combining makes their behaviours incompatible, and thus one's got to decide whether they want the *sequential* part, or the *combining* part.

Since you're likely to need both in you application, Folktale divides that in Either/Result (the *sequential* part), and Validation (the *combining* part). Starting with Folktale 2, you can easily convert between the two with `Result#toValidation()` and `Validation#toResult()`. It's possible to write equivalent conversion functions in Folktale 1, but none is provided out of the box.


[Monad]: https://github.com/fantasyland/fantasy-land#monad
[Applicative]: https://github.com/fantasyland/fantasy-land#applicative



## Folktale and the JavaScript ecosystem

### Can I use Folktale with Flow or TypeScript?

> **Short answer**
> Yes, but there are no type definitions for them currently, and some of the features in Folktale require more advanced type system concepts that they don't support.
{:.note}

It is possible to use Folktale with Flow and TypeScript, however some of the features Folktale relies on can't be expressed in those type systems, and so they must be described with the `any` type. This is not as useful for static checking, and it might make using some of the features more annoying or more difficult.

Better support for some of the features that Folktale uses depends on the concept of Higher-Kinded Polymorphism (very roughly: types that generalise other types. Think of generics, but instead of generalising the `x` in `List<x>`, it generalises the `List` and the `x` in `List<x>`). Right now, the status of supporting HKP in Flow is ["maybe at some point in the future"](https://github.com/facebook/flow/issues/30), meanwhile TypeScript's status is ["we like the idea, but it's a lot of effort and low priority. We're accepting PRs, though"](https://github.com/Microsoft/TypeScript/issues/1213#issuecomment-275222845), with some of the community trying to work something out. So, maybe in the future, but definitely not right now.

That said, [*basic* support for TypeScript is planned](https://github.com/origamitower/folktale/issues/65) for the initial 2.0 release. Right now you can use it if you explicitly declare the module to have the `any` type (or rely on implicit `any`, but that's even less ideal). Not great, but works. Support for Flow *might* come after that, but no guarantees.

> **NOTES**
> - [@jongold](https://github.com/jongold) has started a project with [Flow definitions for Folktale 1](https://github.com/jongold/folktale-flow). Currently it has definitions for Data.Task.
{:.note}


### Do Folktale structures implement Fantasy Land?

> **Short answer**
> Yes. Folktale 1 implements fantasy-land@1.x, and Folktale 2 implements fantasy-land@1.x up to fantasy-land@3.x, wherever possible.
{:.note}

Refer to the table below for implemented algebras:

#### Folktale 1

Folktale 1 implements only the non-prefixed methods of Fantasy Land v0.x~1.x.


|                     | **Maybe** | **Either** | **Validation** | **Task**  |
| ------------------- | :-------: | :--------: | :------------: | :-------: |
| [Setoid][]          | ❌         | ❌         | ❌              | 🚫         |
| [Semigroup][]       | ❌         | ✅          | ❌              | ✅¹        |
| [Monoid][]          | 🚫²        | 🚫²        | 🚫²            | ✅¹        |
| [Functor][]         | ✅         | ✅          | ✅              | ✅         |
| [Contravariant][]   | 🚫        | 🚫         | 🚫             | 🚫         | 
| [Apply][]           | ✅         | ✅          | ✅              | ✅         |
| [Applicative][]     | ✅         | ✅          | ✅              | ✅3        |
| [Alt][]             | ❌         | ❌          | ❌             | ❌         |
| [Plus][]            | ❌         | ❌          | ❌             | ❌         |
| [Alternative][]     | ❌         | ❌          | ❌             | ❌         |
| [Foldable][]        | ❌         | ❌          | ❌             | ❌         |
| [Traversable][]     | ❌         | ❌          | ❌             | ❌         |
| [Chain][]           | ✅         | ✅          | 🚫⁴             | ✅         |
| [ChainRec][]        | ❌         | ❌          | 🚫⁴            | ❌        |
| [Monad][]           | ✅         | ✅          | 🚫⁴            | ✅         |
| [Extend][]          | 🚫⁵       | 🚫⁵        | 🚫⁵            | 🚫⁵        |
| [Comonad][]         | 🚫⁵       | 🚫⁵        | 🚫⁵            | 🚫⁵        |
| [Bifunctor][]       | 🚫⁶       | ✅          | ✅              | ✅         |
| [Profunctor][]      | 🚫        | 🚫         | 🚫             | 🚫        |

#### Folktale 2

Folktale 2 implements *both* unprefixed and prefixed methods, and thus supports Fantasy Land v0.x~3.x.

> **NOTE**
> The structures implement the old version of `.ap` (`fn.ap(value)`), and the new version of `."fantasy-land/ap"` (`value['fantasy-land/ap'](fn)`). Fantasy Land actually made this breaking change without bumping the major version first. If some library expects the unprefixed method to implement the new argument order, things won't work nicely.
{:.note}

|                     | **Maybe** | **Result** | **Validation** | **Task**  | **Future** |
| ------------------- | :-------: | :--------: | :------------: | :-------: | :--------: |
| [Setoid][]          | ✅         | ✅         | ✅              | 🚫         | 🚫          |
| [Semigroup][]       | 🔜         | 🔜         | ✅              | ❌        | ❌          |
| [Monoid][]          | 🚫²        | 🚫²        | 🚫²            | ❌        | ❌          |
| [Functor][]         | ✅         | ✅          | ✅              | ✅         | ✅          |
| [Contravariant][]   | 🚫        | 🚫         | 🚫             | 🚫         | 🚫         |
| [Apply][]           | ✅         | ✅          | ✅              | ✅         | ✅          |
| [Applicative][]     | ✅         | ✅          | ✅              | ✅         | ✅          |
| [Alt][]             | 🔜         | 🔜         | 🔜             | 🔜        | 🔜        |
| [Plus][]            | 🔜         | 🔜         | 🔜             | 🔜        | 🔜        |
| [Alternative][]     | 🔜         | 🔜         | 🔜             | 🔜        | 🔜        |
| [Foldable][]        | ❌         | ❌          | ❌             | ❌         | ❌         |
| [Traversable][]     | ❌         | ❌          | ❌             | ❌         | ❌         |
| [Chain][]           | ✅         | ✅          | 🚫⁴             | ✅         | ✅         |
| [ChainRec][]        | 🔜         | 🔜          | 🚫⁴            | 🔜        | 🔜         |
| [Monad][]           | ✅         | ✅          | 🚫⁴            | ✅         | ✅          |
| [Extend][]          | 🚫⁵       | 🚫⁵        | 🚫⁵            | 🚫⁵        | 🚫⁵         |
| [Comonad][]         | 🚫⁵       | 🚫⁵        | 🚫⁵            | 🚫⁵        | 🚫⁵         |
| [Bifunctor][]       | 🚫⁶       | ✅          | ✅              | ✅         | ✅          |
| [Profunctor][]      | 🚫        | 🚫         | 🚫             | 🚫        | 🚫          |


> **NOTES**
> - ✅: The algebra is implemented for this structure;
> - ❌: The algebra is not implemented for this structure;
> - 🚫: The algebra can't be implemented for this structure;
> - 🔜: The algebra will be implemented for this structure in the future.
>
> ---
>
> - ¹: The Task instance of Monoid is non-deterministic, and the equivalent of Promise.race.
> - ²: Implementing a generic Monoid would require return-type polymorphism. It's theoretically possible, but not practically possible (requires free monoids and late reifying). See https://eighty-twenty.org/2015/01/25/monads-in-dynamically-typed-languages for a detailed explanation.
> - ³: Resolves Tasks in parallel, so may be observably different than the Monad instance if the ordering of effects matters.
> - ⁴: See [Why is there no `.chain`/Monad for Validation?](#why-is-there-no-chain-for-validation) in this document.
> - ⁵: It's not possible to implement these without being partial, so we choose to not implement it.
> - ⁶: One side of the Maybe is nullary, and Bifunctor requires two unary functions.
 

[Monad]: https://github.com/fantasyland/fantasy-land#monad
[Applicative]: https://github.com/fantasyland/fantasy-land#applicative
[Setoid]: https://github.com/fantasyland/fantasy-land#setoid
[Semigroup]: https://github.com/fantasyland/fantasy-land#semigroup
[Monoid]: https://github.com/fantasyland/fantasy-land#monoid
[Functor]: https://github.com/fantasyland/fantasy-land#functor
[Contravariant]: https://github.com/fantasyland/fantasy-land#contravariant
[Apply]: https://github.com/fantasyland/fantasy-land#apply
[Alt]: https://github.com/fantasyland/fantasy-land#alt
[Plus]: https://github.com/fantasyland/fantasy-land#plus
[Alternative]: https://github.com/fantasyland/fantasy-land#alternative
[Foldable]: https://github.com/fantasyland/fantasy-land#foldable
[Traversable]: https://github.com/fantasyland/fantasy-land#traversable
[Chain]: https://github.com/fantasyland/fantasy-land#chain
[ChainRec]: https://github.com/fantasyland/fantasy-land#chainrec
[Extend]: https://github.com/fantasyland/fantasy-land#extend
[Comonad]: https://github.com/fantasyland/fantasy-land#comonad
[Bifunctor]: https://github.com/fantasyland/fantasy-land#bifunctor
[Profunctor]: https://github.com/fantasyland/fantasy-land#profunctor
