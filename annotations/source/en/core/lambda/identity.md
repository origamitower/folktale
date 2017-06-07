@annotate: folktale.core.lambda.identity
category: Functional combinators
---
The identity combinator; always returns the argument given.


## Example::

    const identity = require('folktale/core/lambda/identity');

    identity(1);
    // ==> 1

    [1, 2, 3].map(identity);
    // ==> [1, 2, 3]


## Why?

There aren't many reasons to use the `identity` combinator in real
JavaScript code. Readability is the only compelling one. Figuring
out the concept of `identity` from reading the word `identity` is
easier than working your way through its implementation.

Compare:

    const identity = require('folktale/core/lambda/identity');

    either.bimap(identity, (counter) => counter + 1);

With:

    either.bimap(
      (failure) => failure,
      (counter) => counter + 1
    )
