@annotate: folktale.core.lambda.constant
category: Functional combinators
---
The constant combinator; always returns the first argument given.


## Example::

    const constant = require('folktale/core/lambda/constant');

    [1, 2, 3].map(constant(0));
    // ==> [0, 0, 0]


## Why?

Constant combinators can be passed to higher-order operations if you
want to provide a plain value, but the operation expects a function
providing a value::

    const constant = require('folktale/core/lambda/constant');

    [1, 2, 3].map(constant(0));
    // ==> [0, 0, 0]

For a primitive, there's usually not much of a difference between
using the `constant` combinator or an arrow function. In fact, for
most cases, using the arrow function is preferred::

    [1, 2, 3].map(() => 0);
    // ==> [0, 0, 0]

The problem with using arrows is that the value is computed lazily.
That is, it's computed only when the arrow is evaluated, and recomputed
many times if the arrow is evaluated many times. The `constant` combinator
lets you evaluate something eagerly instead.

You can see the importance of this when effects are involved::

    let counter = 0;
    const next = () => ++counter;

    ['a', 'b', 'c'].map(constant(next()));
    // ==> [1, 1, 1]

    counter = 0;
    ['a', 'b', 'c'].map(_ => next());
    // ==> [1, 2, 3]

Expensive pure computations are another place where `constant` is desirable
over plain arrows, given that one'd rather avoid re-evaluating the
computation unnecessarily.
