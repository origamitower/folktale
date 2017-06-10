@annotate: folktale.validation.Failure.prototype.bimap
@annotate: folktale.validation.Success.prototype.bimap
category: Transforming
---

Transforms each side of a Validation with a function, without changing the status of the validation. That is, failures will still be failures, successes will still be successes.


## Example::

    const Validation = require('folktale/validation');

    const upcase = (a) => a.toUpperCase();
    const duplicate = (a) => `${a}${a}`;

    Validation.Success('a').bimap(duplicate, upcase);
    // ==> Validation.Success('A')

    Validation.Failure('a').bimap(duplicate, upcase);
    // ==> Validation.Failure('aa')