@annotate: folktale.conversions.nullableToValidation
category: Converting from nullables
---
Converts a nullable value to a `Validation`. `null` and `undefined`
map to `Failure`s, any other type maps to `Success`es.

A nullable is a value that may be any type, or `null`/`undefined`.


## Example::

    const nullableToValidation = require('folktale/conversions/nullable-to-validation');
    const { Failure, Success } = require('folktale/validation');
    
    nullableToValidation(undefined, 'error');
    // ==> Failure('error')

    nullableToValidation(null, 'error');
    // ==> Failure('error')

    nullableToValidation(1, 'error');
    // ==> Success(1)
