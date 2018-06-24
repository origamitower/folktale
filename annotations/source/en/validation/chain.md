@annotate: folktale.validation.chain
category: Transforming
---

Transforms the value and context of a Validation computation with an unary function.
As with `.map()`, the transformation is only applied if the value is a `Success`,
but the transformation is expected a new `Validation` value, which then becomes the
result of the function.

## Example::

    const { Success, Failure, chain } = require('folktale/validation');

    chain(Success('a'), x => Success(x.toUpperCase()));
    // ==> Success('A')

    chain(Success('a'), x => Failure(x));
    // ==> Failure('a')

    chain(Failure('a'), x => Success(x.toUpperCase()));
    // ==> Failure('a')