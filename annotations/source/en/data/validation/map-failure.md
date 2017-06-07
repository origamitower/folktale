@annotate: folktale.data.validation.Failure.prototype.mapFailure
@annotate: folktale.data.validation.Success.prototype.mapFailure
category: Transforming
---

Transforms the failure value inside a Validation structure with an unary function without changing the status of the validation. That is, Success values continue to be Success values, Failure values continue to be Failure values.


## Example::

    const { Success, Failure } = require('folktale/data/validation');

    const upcase = (a) => a.toUpperCase();

    Success('a').mapFailure(upcase);
    // ==> Success('a')

    Failure('a').mapFailure(upcase);
    // ==> Failure('A')