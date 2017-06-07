@annotate: folktale.data.validation.fromResult
category: Converting from other types
---

A convenience method for the `folktale/data/conversions/result-to-validation` module.

## Example::

    const Result = require('folktale/data/result');
    const Validation = require('folktale/data/validation');

    Validation.fromResult(Result.Ok(1));
    // ==> Validation.Success(1)

    Validation.fromResult(Result.Error('error'));
    // ==> Validation.Failure('error')