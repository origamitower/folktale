@annotate: folktale.data.conversions.resultToValidation
category: Converting from Result
---
Converts an `Result` to a `Validation`. `Error`s map to `Failure`s, `Ok`s map
to `Success`es.


## Example::

    const resultToValidation = require('folktale/data/conversions/result-to-validation');
    const { Error, Ok } = require('folktale/data/result');
    const { Failure, Success } = require('folktale/data/validation');

    resultToValidation(Error(1));  // ==> Failure(1)
    resultToValidation(Ok(1)); // ==> Success(1)
