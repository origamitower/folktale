@annotate: folktale.data.conversions.nullableToResult
category: Converting from nullables
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
