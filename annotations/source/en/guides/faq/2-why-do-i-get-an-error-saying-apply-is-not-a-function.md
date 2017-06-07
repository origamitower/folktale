@guide: Why do I get an error saying "`.apply` is not a function"?
parent: folktale['Frequently Asked Questions']
category: Common mistakes
authors:
  - "@robotlolita"
---

Short answer: Folktale unrolls application of curried functions, so if you pass more arguments than what a function takes, that function might try passing some of those arguments to its return value.

JavaScript makes heavy use of variadic functions (functions that may receive a varying number of arguments, rather than a fixed one). Meanwhile, functional programming makes heavy use of a technique called [currying](http://origamitower.github.io/folktale/api/en/folktale.src.core.lambda.curry.curry.html#what-is-currying-). These two are largely incompatible, as currying relies on functions taking exactly one argument, and returning either the result of the computation (all dependencies have been gathered), or a new curried function to gather more arguments.

Both Folktale 1 and Folktale 2 use currying in its functions. Due to the problems with variadic functions, currying is avoided by default in Folktale 2, but you may still run into them. The core of the issue lies within the effort Folktale makes to allow composing curried functions arbitrarily, through *unrolling* function application. This is done so curried functions may interact seamlessly with JavaScript's regular functions that may know nothing about currying:

```js
// math3 takes exactly 3 arguments, 1 at a time
const math3 = curry(3, (a, b, c) => a - b + c);

math3(4)(2)(1); // ==> 3

// flip knows nothing about currying (it passes more than one argument)
const flip = (f) => (a, b) => f(b, a);

flip(math3(4))(1, 2); // ==> math3(4)(2, 1)
```

Now, if Folktale forced curried functions to take exactly one argument at a time, then `math3(4)(2, 1)` would ignore the second argument, and thus instead of the expected result, `3`, you'd get back a function that expects one more argument. This is awkward in JavaScript, so instead Folktale's curry creates functions that *unroll* their application. That is:

```js
    math3(4, 2, 1)
=== math3(4, 2)(1) or math3(4)(2, 1)
=== math3(4)(2)(1)
```

It takes those many arguments and applies them one by one, until they're all passed to the functions your curried one may return. The [new docs have a more detailed description of how this works](http://origamitower.github.io/folktale/api/en/folktale.src.core.lambda.curry.curry.html#-curry-under-the-hood). This means that our `flip(maths(4))(1, 2)` works, even though `flip` was not written for curried functions. That's great.

But what happens when we provide more arguments than what a curried function can take? Well, it depends. If you're using Folktale 1's `core.lambda/curry`, then those additional arguments are passed down to the resulting function regardless:

```js
flip(math3(4))(1, 2)
// ==> math3(4)(2, 1)
// ==> math3(4)(2)(1) 
// ==> 3

flip(math3(4, 2))(1, 3)
// ==> math3(4, 2)(1, 3) 
// ==> math3(4)(2)(1)(3) 
// ==> 3(3) 
// ==> TypeError: (3).apply(...) is not a function
```

That's… not great. This happens quite often in JavaScript because most functions are variadic, so JavaScript APIs just pass a bunch of arguments that your function can ignore by simply not declaring them in its signature. `Array#map` is a good example:

```js
[1, 2, 3].map((element, index, array) => element + 1);
// ==> [2, 3, 4]

// This is also fine:
[1, 2, 3].map((element) => element + 1);
// ==> [2, 3, 4]
```

`.map` is still passing 3 arguments to the second function, so the number of arguments passed is still 3 even if the function declares no intention of accessing the other 2. Folktale 2 mitigates this a bit. The application is only unrolled if the resulting function has been marked as a Folktale curried function. This way:

```js
flip(math3(4))(1, 2)
// ==> math3(4)(2, 1)
// ==> math3(4)(2)(1) 
// ==> 3

flip(math3(4, 2))(1, 3)
// ==> math3(4, 2)(1, 3) 
// ==> math3(4)(2)(1) ^-- ignored as 3 is not a Folktale curried fn
// ==> 3 
```
