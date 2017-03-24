@guide: Why is there no `.chain` for Validation?
parent: folktale['Frequently Asked Questions']
category: Common mistakes
authors:
  - "@robotlolita"
---

Short answer: the way Validation's `.ap` method works makes it impossible to implement the [Monad](https://github.com/fantasyland/fantasy-land#monad) interface (`.chain`). You might either want to use Either/Result, or rethink how you're approaching the problem.

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

```js
Failure('hello').ap(Failure(', ')).ap(Failure('world!'));
```

We get:

```js
Failure('hello'.concat(', ').concat('world!'));
```

This is in line with the goal of combining all of the errors (as in the form validation example), but how exactly does this prevent Validation from having a `.chain` method? It's more that Validation can't *implement* [Monad][] than it being unable to have a `.chain` method, but it so happens that in Fantasy Land, adding a `.chain` method when you have a `.of` method is considered an implementation of [Monad][]. And if you implement [Monad][], turns out your methods have to satisfy some requirements (so people can write generic code that doesn't behave weirdly here and there). The requirement that matters here is this one:

```js
V1.map(x => y => [x, y]).ap(V2) = V1.chain(x => V2.map(y => [x, y]));
```

So, if you implement [Monad][] and [Applicative][], then the code on the left has to be equivalent (i.e.: do the same thing) as the code on the right. If we were to implement `.chain` for Validation, it would look like this:

    Success(x) chain f => f(x)        -- `f` has to return a Validation
    Failure(x) chain f => Failure(x)

Quite simple, right? But remember our definition of `.ap`? Let's compare some results and see why these aren't equivalent:

```js
Success('1').chain(x => Success('2').map(y => x + y))        // ==> Success('12')
Success(x => y => x + y).ap(Success('1')).ap(Success('2'))   // ==> Success('12')

Success('1').chain(x => Failure('2').map(y => x + y))        // ==> Failure('2')
Success(x => y => x + y).ap(Success('1')).ap(Failure('2'))   // ==> Failure('2')

Failure('1').chain(x => Success('2').map(y => x + y))        // ==> Failure('1')
Success(x => y => x + y).ap(Failure('1')).ap(Success('2'))   // ==> Failure('1')

Failure('1').chain(x => Failure('2').map(y => x + y))        // ==> Failure('1')
Success(x => y => x + y).ap(Failure('1')).ap(Failure('2'))   // ==> Failure('12')
```

Oops. The last case doesn't behave quite the same. Since the `.chain` method can't execute the function to get the other Failure, the only thing it can do is return the Failure it's got. Meanwhile, `.ap` can compare both values and decide how to combine them. But this combining makes their behaviours incompatible, and thus one's got to decide whether they want the *sequential* part, or the *combining* part.

Since you're likely to need both in you application, Folktale divides that in Either/Result (the *sequential* part), and Validation (the *combining* part). Starting with Folktale 2, you can easily convert between the two with `Result#toValidation()` and `Validation#toResult()`. It's possible to write equivalent conversion functions in Folktale 1, but none is provided out of the box.


[Monad]: https://github.com/fantasyland/fantasy-land#monad
[Applicative]: https://github.com/fantasyland/fantasy-land#applicative