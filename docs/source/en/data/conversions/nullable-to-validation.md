@annotate: folktale.data.conversions.nullableToValidation
category: Converting from nullables
---
Converts a nullable value to a `Validation`. `null` and `undefined`
map to `Failure`s, any other type maps to `Success`es.

A nullable is a value that may be any type, or `null`/`undefined`.


## Example::

    const nullableToValidation = require('folktale/data/conversions/nullable-to-validation');
    const { Failure, Success } = require('folktale/data/validation');
    
    nullableToValidation(undefined); // ==> Failure(undefined)
    nullableToValidation(null);      // ==> Failure(null)
    nullableToValidation(1);         // ==> Success(1)
