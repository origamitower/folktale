@annotate: folktale.data.validation.Failure.prototype.map
@annotate: folktale.data.validation.Success.prototype.map
category: Transforming
---

Transforms the successful value inside a Validation structure with an unary function without changing the status of the validation. That is, Success values continue to be Success values, Failure values continue to be Failure values.


## Example::

    const { Success, Failure } = require('folktale/data/validation');

    const upcase = (a) => a.toUpperCase();

    Success('a').map(upcase);
    // ==> Success('A')

    Failure('a').map(upcase);
    // ==> Failure('a')