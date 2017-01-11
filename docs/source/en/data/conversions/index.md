@annotate: folktale.data.conversions
---
Provides functions to convert from and to different data
structures.



@annotate: folktale.data.conversions.resultToMaybe
---
Converts an `Result` structure to a Maybe structure. `Error`s map to `Nothing`s,
`Ok`s map to `Just`s.

Not that `Error` values are lost in the conversion process, since failures
in `Maybe` (the `Nothing` tag) don't have a value.

## Example::

    const resultToMaybe = require('folktale/data/conversions/result-to-maybe');
    const { Error, Ok } = require('folktale/data/result');
    const { Just, Nothing } = require('folktale/data/maybe');
    
    resultToMaybe(Error(1));  // ==> Nothing()
    resultToMaybe(Ok(1)); // ==> Just(1) 



@annotate: folktale.data.conversions.resultToValidation
---
Converts an `Result` to a `Validation`. `Error`s map to `Failure`s, `Ok`s map
to `Success`es.


## Example::

    const resultToValidation = require('folktale/data/conversions/result-to-validation');
    const { Error, Ok } = require('folktale/data/result');
    const { Failure, Success } = require('folktale/data/validation');

    resultToValidation(Error(1));  // ==> Failure(1)
    resultToValidation(Ok(1)); // ==> Success(1)



@annotate: folktale.data.conversions.maybeToResult
---
Converts a `Maybe` to an `Result`. `Nothing`s map to `Error`s, `Just`s map to
`Ok`s.

Note that since `Maybe`s don't hold a value for failures in the `Nothing` tag, 
you must provide one to this function.


## Example::

    const maybeToResult = require('folktale/data/conversions/maybe-to-result');
    const { Error, Ok } = require('folktale/data/result');
    const { Nothing, Just } = require('folktale/data/maybe');

    maybeToResult(Nothing(), 2); // ==> Error(2)
    maybeToResult(Just(1), 2);   // ==> Ok(1)



@annotate: folktale.data.conversions.maybeToValidation
---
Converts a `Maybe` to a `Validation`. `Nothing`s map to `Failure`s, `Just`s map
to `Success`es.

Note that since `Maybe` failures can't hold a value in the `Nothing` tag, you 
must provide one for the validation.

## Example::

    const maybeToValidation = require('folktale/data/conversions/maybe-to-validation');
    const { Failure, Success } = require('folktale/data/validation');
    const { Nothing, Just } = require('folktale/data/maybe');

    maybeToValidation(Nothing(), 2);  // ==> Failure(2)
    maybeToValidation(Just(1), 2);    // ==> Success(1)



@annotate: folktale.data.conversions.nullableToResult
---
Converts a nullable value to a `Result`. `null` and `undefined` map to
`Error`s, any other value maps to `Ok`s.

A nullable is a value that may be any type, or `null`/`undefined`.


## Example::

    const nullableToResult = require('folktale/data/conversions/nullable-to-result');
    const { Error, Ok } = require('folktale/data/result');

    nullableToResult(undefined);  // ==> Error(undefined)
    nullableToResult(null);       // ==> Error(null)
    nullableToResult(1);          // ==> Ok(1)



@annotate: folktale.data.conversions.nullableToMaybe
---
Converts a nullable value to a maybe. `null` and `undefined` map to
`Nothing`, any other value maps to `Just`s.

A nullable is a value that may be any type, or `null`/`undefined`. Since
`Nothing` can't hold values, it's not possible to differentiate whether
the original value was `null` or `undefined` after the conversion.

## Example::

    const nullableToMaybe = require('folktale/data/conversions/nullable-to-maybe');
    const { Nothing, Just } = require('folktale/data/maybe');

    nullableToMaybe(undefined);  // ==> Nothing()
    nullableToMaybe(null);       // ==> Nothing()
    nullableToMaybe(1);          // ==> Just(1)



@annotate: folktale.data.conversions.nullableToValidation
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



@annotate: folktale.data.conversions.validationToResult
---
Converts a `Validation` to an `Result`. `Failure`s map to `Error`s,
`Success`es map to `Ok`s.

## Example::

    const validationToResult = require('folktale/data/conversions/validation-to-result');
    const { Error, Ok } = require('folktale/data/result');
    const { Failure, Success } = require('folktale/data/validation');

    validationToResult(Failure(1));  // ==> Error(1)
    validationToResult(Success(1));  // ==> Ok(1) 



@annotate: folktale.data.conversions.validationToMaybe
---
Converts a `Validation` to a `Maybe`. `Failure`s map to `Nothing`s,
`Success`es map to `Just`s.

`Failure` values are lost in the process, since the `Nothing` tag can't
hold any values.


## Example::

    const validationToMaybe = require('folktale/data/conversions/validation-to-maybe');
    const { Failure, Success } = require('folktale/data/validation');
    const { Nothing, Just } = require('folktale/data/maybe');

    validationToMaybe(Failure(1));  // ==> Nothing()
    validationToMaybe(Success(1));  // ==> Just(1)

