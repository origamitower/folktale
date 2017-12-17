@annotate: folktale.conversions.nullableToResult
category: Converting from nullables
---
Converts a nullable value to a `Result`. `null` and `undefined` map to
`Error`s, any other value maps to `Ok`s.

A nullable is a value that may be any type, or `null`/`undefined`.


> **DEPRECATION WARNING**:  
> In 2.0.x, `nullableToResult` took only one parameter. This form of the
> function is now deprecated in favour of passing an explicit fallback
> value.


## Example::

    const nullableToResult = require('folktale/conversions/nullable-to-result');
    const { Error, Ok } = require('folktale/result');

    nullableToResult(undefined, 'error');
    // ==> Error('error')

    nullableToResult(null, 'error');
    // ==> Error('error')

    nullableToResult(1, 'error');
    // ==> Ok(1)

