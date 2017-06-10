@annotate: folktale.validation.fromResult
category: Converting from other types
---

A convenience method for the `folktale/conversions/result-to-validation` module.

## Example::

    const Result = require('folktale/result');
    const Validation = require('folktale/validation');

    Validation.fromResult(Result.Ok(1));
    // ==> Validation.Success(1)

    Validation.fromResult(Result.Error('error'));
    // ==> Validation.Failure('error')