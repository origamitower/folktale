@annotate: folktale.validation.Failure.prototype.orElse
@annotate: folktale.validation.Success.prototype.orElse
category: Recovering from errors
---

Allows recovering from Failure values with a handler function.


## Example::

    const { Success, Failure } = require('folktale/validation');

    Success('a').orElse(e => Success('b'));
    // ==> Success('a')

    Failure('a').orElse(e => Success('b'));
    // ==> Success('b')

    Failure('a').orElse(e => Failure('b'));
    // ==> Failure('b')