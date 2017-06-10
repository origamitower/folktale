@annotate: folktale.result.Error.prototype.swap
@annotate: folktale.result.Ok.prototype.swap
category: Recovering from errors
---

Inverts the context of a Result value such that Errors are transformed into Oks,
and Oks are transformed into Errors. Does not touch the value inside of the
Result.


## Example::

    const Result = require('folktale/result');
    
    Result.Ok(1).swap();
    // ==> Result.Error(1)
    
    Result.Error(1).swap();
    // ==> Result.Ok(1)
