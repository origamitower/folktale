@annotate: folktale.data.maybe.fromValidation
category: Converting from other types
---

A convenience method for the `folktale/data/conversions/validation-to-maybe` module.

Note that `Failure` values are discarded, since `Nothing` can't hold a value.

## Example::

    const Maybe = require('folktale/data/maybe');
    const Validation = require('folktale/data/validation');
    
    Maybe.fromValidation(Validation.Success(1));
    // ==> Maybe.Just(1)
    
    Maybe.fromValidation(Validation.Failure(1));
    // ==> Maybe.Nothing()
