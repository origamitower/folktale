@annotate: folktale.data.conversions.validationToResult
category: Converting from Validation
---
Converts a `Validation` to an `Result`. `Failure`s map to `Error`s,
`Success`es map to `Ok`s.

## Example::

    const validationToResult = require('folktale/data/conversions/validation-to-result');
    const { Error, Ok } = require('folktale/data/result');
    const { Failure, Success } = require('folktale/data/validation');

    validationToResult(Failure(1));  // ==> Error(1)
    validationToResult(Success(1));  // ==> Ok(1) 
