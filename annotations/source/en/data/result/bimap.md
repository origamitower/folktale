@annotate: folktale.data.result.Error.prototype.bimap
@annotate: folktale.data.result.Ok.prototype.bimap
category: Transforming
---

Transforms each side of a Result with a function, without changing the context
of the computation. That is, Errors will still be Errors, Oks will still be
Oks.


## Example::

    const Result = require('folktale/data/result');
    
    const inc = (x) => x + 1;
    const dec = (x) => x - 1;
    
    
    Result.Ok(1).bimap(inc, dec);
    // ==> Result.Ok(dec(1))
    
    Result.Error(1).bimap(inc, dec);
    // ==> Result.Error(inc(1))
