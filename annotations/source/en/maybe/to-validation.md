@annotate: folktale.maybe.Just.prototype.toValidation
@annotate: folktale.maybe.Nothing.prototype.toValidation
category: Converting to other types
---

A convenience method for the `folktale/conversions/maybe-to-validation` module.

## Example::

    const Maybe = require('folktale/maybe');
    const Validation = require('folktale/validation');

    Maybe.Just(1).toValidation(0);
    // ==> Validation.Success(1)

    Maybe.Nothing().toValidation(0)
    // ==> Validation.Failure(0)
