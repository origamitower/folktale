@annotate: folktale.result.fromNullable
category: Converting from other types
---

A convenience method for the `folktale/conversions/nullable-to-result`
module.

> **DEPRECATION WARNING**:  
> In 2.0.x, `fromNullable` took only one parameter. This form of the
> method is now deprecated in favour of passing an explicit fallback
> value.


## Example::

    const Result = require('folktale/result');

    Result.fromNullable(1, 'error');
    // ==> Result.Ok(1)

    Result.fromNullable(null, 'error');
    // ==> Result.Error('error')

    Result.fromNullable(undefined, 'error');
    // ==> Result.Error('error')
