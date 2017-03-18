@annotate: folktale.data.result.Ok.prototype.toValidation
@annotate: folktale.data.result.Error.prototype.toValidation
category: Converting to other types
---

Transforms a Result into a Validation.

Result's `Ok`s are mapped into Validation's `Success`es, and Result's `Error`s
are mapped into Validation's `Failure`s.


## Example::

    const Result = require('folktale/data/result');
    const Validation = require('folktale/data/validation');
    
    Result.Ok(1).toValidation();
    // ==> Validation.Success(1)
    
    Result.Error(1).toValidation();
    // ==> Validation.Failure(1)
