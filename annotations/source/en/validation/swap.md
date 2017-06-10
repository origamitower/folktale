@annotate: folktale.validation.Failure.prototype.swap
@annotate: folktale.validation.Success.prototype.swap
category: Recovering from errors
---

Inverts the status of a Validation, such that Failures become Successes, and vice-versa.


## Example::

    const { Success, Failure } = require('folktale/validation');

    Success('a').swap();
    // ==> Failure('a')

    Failure('a').swap();
    // ==> Success('a')