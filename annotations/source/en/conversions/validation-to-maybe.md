@annotate: folktale.conversions.validationToMaybe
category: Converting from Validation
---
Converts a `Validation` to a `Maybe`. `Failure`s map to `Nothing`s,
`Success`es map to `Just`s.

`Failure` values are lost in the process, since the `Nothing` tag can't
hold any values.


## Example::

    const validationToMaybe = require('folktale/conversions/validation-to-maybe');
    const { Failure, Success } = require('folktale/validation');
    const { Nothing, Just } = require('folktale/maybe');

    validationToMaybe(Failure(1));  // ==> Nothing()
    validationToMaybe(Success(1));  // ==> Just(1)
