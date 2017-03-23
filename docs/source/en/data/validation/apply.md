@annotate: folktale.data.validation.Failure.prototype.apply
@annotate: folktale.data.validation.Success.prototype.apply
category: Combining validations
---

If successes, applies the function in one Validation to another. Otherwise concatenate the failures.


## Example::

    const { Success, Failure } = require('folktale/data/validation');

    const tuple = (a) => (b) => [a, b];

    Success(tuple).apply(Success(1)).apply(Success(2));
    // ==> Success([1, 2])

    Success(tuple).apply(Success(1)).apply(Failure('a'));
    // ==> Failure('a')

    Success(tuple).apply(Failure('a')).apply(Success(1));
    // ==> Failure('a')

    Success(tuple).apply(Failure('a')).apply(Failure('b'));
    // ==> Failure('ab')