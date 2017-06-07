@annotate: folktale.data.validation.fromMaybe
category: Converting from other types
---

A convenience method for the `folktale/data/conversions/maybe-to-validation` module.

## Example::

    const Validation = require('folktale/data/validation');
    const Maybe = require('folktale/data/maybe');

    Validation.fromMaybe(Maybe.Just(1), 'error');
    // ==> Validation.Success(1)

    Validation.fromMaybe(Maybe.Nothing(), 'error');
    // ==> Validation.Failure('error')