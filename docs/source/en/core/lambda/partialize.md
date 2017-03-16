@annotate: folktale.core.lambda.partialize
category: Partialization / Currying
throws:
  - TypeError: when the number of arguments given doesn't match the arity.
---
Creates a new function where some of the arguments are specified.


## Example::

    const partialize = require('folktale/core/lambda/partialize');

    const clamp = (min, max, number) =>
      number < min ?  min
    : number > max ?  max
    :                 number;

    const _      = partialize.hole;
    const clamp_ = partialize(3, clamp);

    const atLeast = clamp_(_, Infinity, _);
    const atMost  = clamp_(-Infinity, _, _);

    atLeast(3, 2); // ==> 3
    atLeast(3, 5); // ==> 5

    atMost(5, 3);  // ==> 3
    atMost(5, 10); // ==> 5


## Why Partialisation

With higher-order programming, one often wants to specialise some of
the arguments of a function before passing it to another function.
This kind of configuration is often done by creating a new function
manually::

    const plus = (a, b) => a + b;
    const add5 = (x) => plus(5, x);

    [1, 2, 3].map(add5);
    // ==> [6, 7, 8]

And for most cases this is reasonable. For functions that take more
parameters, this can be cumbersome, however. The `partialize` function
allows creating a new function by specialising some of the arguments,
and filling the remaining ones when the function is called.

Places where the caller of the function should fill are specified as
`hole`, which is a special constant used by `partialize`::

    const partialize = require('folktale/core/lambda/partialize');

    const _ = partialize.hole;
    const partialAdd5 = partialize(2, plus)(5, _);
    [1, 2, 3].map(partialAdd5);
    // ==> [6, 7, 8]


## Relation to Currying

Partial application and currying are related concepts. Currying
refers to transforming a function of arity N, into N functions of
arity 1. Partial application, on the other hand, refers to
fixing some (but not all) arguments of a function.

Both concepts are used to improve function composition, where the
shape of the function you have does not reflect the shape of the
function expected by function you're calling. So, in essence, these
techniques transform the shape of your function to make them "fit"
some API.

`partialize` and `curry` differ on how they achieve this, however.
While `curry` creates N functions, and lets you specify arguments
one by one, `partialize` requires you to specify all arguments at
once, distinguishing which ones are fixed, and which ones have to
be provided (using "holes").

Because of this, `curry` can be more natural, but it requires that
the APIs be designed thinking about currying before hand, and it
often interacts poorly with JavaScript, due to the use of variadic
functions. `partialize` does not have such problems.


## How `partialize` Works?

The `partialize` function transforms regular functions into
functions that can accept holes for arguments that are not
defined yet. Whenever a partial function receives a hole as
an argument, it constructs a new function so the holes can
be filled later::

    const partialize = require('folktale/core/lambda/partialize');

    const clamp = (min, max, number) =>
      number < min ?  min
    : number > max ?  max
    :                 number

    const partialClamp = partialize(3, clamp);

In the example above, `partialClamp` is a function that takes
arguments that may or may not be holes. A hole is a special
constant defined by `partialize` itself. It's convenient to
bind such constant to the `_` binding::

    const _ = partialize.hole;

A partial function is considered saturated when, among the
arguments provided to it, no hole exists. When a partial function
is saturated, its original behaviour is executed::

    partialClamp(3, 5, 6);  // ==> 5

If a partial function is not saturated, then it its execution
results in a new partial function::

    const atLeast = partialClamp(_, Infinity, _);
    atLeast(5, 3); // ==> 5

    const atLeast5 = atLeast(5, _);
    atLeast5(3); // ==> 5

Note that to prevent confusing behaviour, Folktale's `partialize`
forces you to always pass the exact number of arguments that the
partial function expects. Passing more or less arguments to a
partial function is a TypeError. This ensures that all new partial
functions can properly invoke the original behaviour when saturated,
rather than returning previous unsaturated functions.


## Drawbacks of Using `partialize`

`partialize` is a convenience function for transforming the shape
of functions, and it relies on variadic application, as well as
doing a fair bit of processing before each call to determine
saturation. Combined, these make `partialize` a poor choice for
any code that needs to be performant.


@annotate: folktale.core.lambda.partialize.hole
category: Special values
---
Represents a place in an argument list that needs to be filled.

