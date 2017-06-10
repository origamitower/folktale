@annotate: folktale.result.Error.prototype.orElse
@annotate: folktale.result.Ok.prototype.orElse
category: Recovering from errors
---

Allows recovering from `Error` values with a handler function.

While `.chain()` allows one to sequence operations, such that the second
operation is ran only if the first one succeeds, the `.orElse()` method allows
one to recover from an `Error` by running a function that provides a new Result
value.


## Example::

    const Result = require('folktale/result');
    
    Result.Ok(4).orElse(error => Result.Ok(error + 1));
    // ==> Result.Ok(4)
    
    Result.Error(4).orElse(error => Result.Ok(error + 1));
    // ==> Result.Ok(5)
    
    Result.Error(4).orElse(error => Result.Error(error - 1));
    // ==> Result.Error(3)
