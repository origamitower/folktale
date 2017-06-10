@annotate: folktale.result.Error.prototype.map
@annotate: folktale.result.Ok.prototype.map
category: Transforming
---

Transforms the value inside of a Result structure with an unary function without
changing the context of the computation. That is, `Error` values continue to be
`Error` values, and `Ok` values continue to be `Ok` values.

## Example::

    const Result = require('folktale/result');
    
    function increment(value) {
      return value + 1;
    }
    
    Result.Ok(1).map(increment);
    // ==> Result.Ok(2)
    
    Result.Error(1).map(increment);
    // ==> Result.Error(1)
