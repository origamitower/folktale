@annotate: folktale.conversions.nullableToResult
category: Converting from nullables
---
Converts a nullable value to a `Result`. `null` and `undefined` map to
`Error`s, any other value maps to `Ok`s.

A nullable is a value that may be any type, or `null`/`undefined`.


## Example::

    const nullableToResult = require('folktale/conversions/nullable-to-result');
    const { Error, Ok } = require('folktale/result');

    nullableToResult(undefined);  // ==> Error(undefined)
    nullableToResult(null);       // ==> Error(null)
    nullableToResult(1);          // ==> Ok(1)
