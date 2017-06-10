@annotate: folktale.result.fromValidation
category: Converting from other types
---

A convenience method for the `folktale/conversions/validation-to-result`
module.

## Example::

    const Result = require('folktale/result');
    const Validation = require('folktale/validation');
    
    Result.fromValidation(Validation.Success(1));
    // ==> Result.Ok(1)
    
    Result.fromValidation(Validation.Failure(1));
    // ==> Result.Error(1)
