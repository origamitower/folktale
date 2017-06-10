@annotate: folktale.conversions.validationToResult
category: Converting from Validation
---
Converts a `Validation` to an `Result`. `Failure`s map to `Error`s,
`Success`es map to `Ok`s.

## Example::

    const validationToResult = require('folktale/conversions/validation-to-result');
    const { Error, Ok } = require('folktale/result');
    const { Failure, Success } = require('folktale/validation');

    validationToResult(Failure(1));  // ==> Error(1)
    validationToResult(Success(1));  // ==> Ok(1) 
