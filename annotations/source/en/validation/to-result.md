@annotate: folktale.validation.Failure.prototype.toResult
@annotate: folktale.validation.Success.prototype.toResult
category: Converting to other types
---

Transforms a Validation into a Reseult.

Validation's `Failure`s are mapped into Result's `Error`s, and Validation's `Success`es are mapped into Result's `Ok`s.


## Example::

    const { Success, Failure } = requiure('folktale/validation');
    const Result = require('folktale/result');

    Success('a').toResult();
    // ==> Result.Ok('a')

    Failure('a').toResult();
    // ==> Result.Error('a')