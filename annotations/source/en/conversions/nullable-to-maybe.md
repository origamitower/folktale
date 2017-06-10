@annotate: folktale.conversions.nullableToMaybe
category: Converting from nullables
---
Converts a nullable value to a maybe. `null` and `undefined` map to
`Nothing`, any other value maps to `Just`s.

A nullable is a value that may be any type, or `null`/`undefined`. Since
`Nothing` can't hold values, it's not possible to differentiate whether
the original value was `null` or `undefined` after the conversion.

## Example::

    const nullableToMaybe = require('folktale/conversions/nullable-to-maybe');
    const { Nothing, Just } = require('folktale/maybe');

    nullableToMaybe(undefined);  // ==> Nothing()
    nullableToMaybe(null);       // ==> Nothing()
    nullableToMaybe(1);          // ==> Just(1)
