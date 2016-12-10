@annotate: folktale.data.conversions
---
Provides functions to convert from and to different data
structures.



@annotate: folktale.data.conversions.eitherToMaybe
---
Converts an `Either` structure to a Maybe structure. `Left`s map to `Nothing`s,
`Right`s map to `Just`s.

Not that `Left` values are lost in the conversion process, since failures
in `Maybe` (the `Nothing` tag) don't have a value.

## Example::

    const { Left, Right } = require('folktale/data/either');
    const { Just, Nothing } = require('folktale/data/maybe');
    eitherToMaybe(Left(1));  // ==> Nothing()
    eitherToMaybe(Right(1)); // ==> Just(1) 



@annotate: folktale.data.conversions.eitherToValidation
---
Converts an `Either` to a `Validation`. `Left`s map to `Failure`s, `Right`s map
to `Success`es.


## Example::

    const { Left, Right } = require('folktale/data/either');
    const { Failure, Success } = require('folktale/data/validation');

    eitherToValidation(Left(1));  // ==> Failure(1)
    eitherToValidation(Right(1)); // ==> Success(1)



@annotate: folktale.data.conversions.maybeToEither
---
Converts a `Maybe` to an `Either`. `Nothing`s map to `Left`s, `Just`s map to
`Right`s.

Note that since `Maybe`s don't hold a value for failures in the `Nothing` tag, 
you must provide one to this function.


## Example::

    const { Left, Right } = require('folktale/data/either');
    const { Nothing, Just } = require('folktale/data/maybe');

    maybeToEither(Nothing(), 2); // ==> Left(2)
    maybeToEither(Just(1), 2);   // ==> Right(1)



@annotate: folktale.data.conversions.maybeToValidation
---
Converts a `Maybe` to a `Validation`. `Nothing`s map to `Failure`s, `Just`s map
to `Success`es.

Note that since `Maybe` failures can't hold a value in the `Nothing` tag, you 
must provide one for the validation.

## Example::

    const { Failure, Success } = require('folktale/data/validation');
    const { Nothing, Just } = require('folktale/data/maybe');

    maybeToValidation(Nothing(), 2);  // ==> Failure(2)
    maybeToValidation(Just(1), 2);    // ==> Success(1)



@annotate: folktale.data.conversions.nullableToEither
---
Converts a nullable value to an either. `null` and `undefined` map to
`Left`s, any other value maps to `Right`s.

A nullable is a value that may be any type, or `null`/`undefined`.


## Example::

    const { Left, Right } = require('folktale/data/either');

    nullableToEither(undefined);  // ==> Left(undefined)
    nullableToEither(null);       // ==> Left(null)
    nullableToEither(1);          // ==> Right(1)



@annotate: folktale.data.conversions.nullableToMaybe
---
Converts a nullable value to a maybe. `null` and `undefined` map to
`Nothing`, any other value maps to `Just`s.

A nullable is a value that may be any type, or `null`/`undefined`. Since
`Nothing` can't hold values, it's not possible to differentiate whether
the original value was `null` or `undefined` after the conversion.

## Example::

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

    const { Failure, Success } = require('folktale/data/validation');
    nullableToValidation(undefined); // ==> Failure(undefined)
    nullableToValidation(null);      // ==> Failure(null)
    nullableToValidation(1);         // ==> Success(1)



@annotate: folktale.data.conversions.validationToEither
---
Converts a `Validation` to an `Either`. `Failure`s map to `Left`s,
`Success`es map to `Right`s.

## Example::

    const { Left, Right } = require('folktale/data/either');
    const { Failure, Success } = require('folktale/data/validation');

    validationToEither(Failure(1));  // ==> Left(1)
    validationToEither(Success(1));  // ==> Right(1) 



@annotate: folktale.data.conversions.validationToMaybe
---
Converts a `Validation` to a `Maybe`. `Failure`s map to `Nothing`s,
`Success`es map to `Just`s.

`Failure` values are lost in the process, since the `Nothing` tag can't
hold any values.


## Example::

    const { Failure, Success } = require('folktale/data/validation');
    const { Nothing, Just } = require('folktale/data/maybe');

    validationToMaybe(Failure(1));  // ==> Nothing()
    validationToMaybe(Success(1));  // ==> Just(1)

