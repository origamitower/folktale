@annotate: folktale.validation.fromNullable
category: Converting from other types
---

A convenience method for the `folktale/conversions/nullable-to-validation` module.

## Example::

    const Validation = require('folktale/validation');

    Validation.fromNullable(1, 'error');
    // ==> Validation.Success(1)

    Validation.fromNullable(null, 'error');
    // ==> Validation.Failure('error')

    Validation.fromNullable(undefined, 'error');
    // ==> Validation.Failure('error')