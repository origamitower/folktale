@annotate: folktale.data.result.Error.prototype.fold
@annotate: folktale.data.result.Ok.prototype.fold
category: Pattern matching
---

Applies a function to each case of a Result.

## Example::

    const Result = require('folktale/data/result');

    const inc = (x) => x + 1;
    const dec = (x) => x - 1;
    
    Result.Error(1).fold(inc, dec);
    // ==> inc(1)
    
    Result.Ok(1).fold(inc, dec);
    // ==> dec(1)
    
