@annotate: folktale.data.result.Error.prototype.mapError
@annotate: folktale.data.result.Ok.prototype.mapError
category: Transforming
---

Transforms the value inside an Error without changing the context of the
computation.

This is similar to `.map`, except it operates on Errors instead of Oks.


## Example::

    const Result = require('folktale/data/result');
    
    Result.Error(1).mapError(x => x + 1);
    // ==> Result.Error(2)
    
    Result.Ok(1).mapError(x => x + 1);
    // ==> Result.Ok(1)
