@annotate: folktale.conversions.resultToValidation
category: Converting from Result
---
Converts an `Result` to a `Validation`. `Error`s map to `Failure`s, `Ok`s map
to `Success`es.


## Example::

    const resultToValidation = require('folktale/conversions/result-to-validation');
    const { Error, Ok } = require('folktale/result');
    const { Failure, Success } = require('folktale/validation');

    resultToValidation(Error(1));  // ==> Failure(1)
    resultToValidation(Ok(1)); // ==> Success(1)
