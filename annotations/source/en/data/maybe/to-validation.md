@annotate: folktale.data.maybe.Just.prototype.toValidation
@annotate: folktale.data.maybe.Nothing.prototype.toValidation
category: Converting to other types
---

A convenience method for the `folktale/data/conversions/maybe-to-validation` module.

## Example::

    const Maybe = require('folktale/data/maybe');
    const Validation = require('folktale/data/validation');

    Maybe.Just(1).toValidation(0);
    // ==> Validation.Success(1)

    Maybe.Nothing().toValidation(0)
    // ==> Validation.Failure(0)
