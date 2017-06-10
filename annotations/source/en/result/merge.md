@annotate: folktale.result.Error.prototype.merge
@annotate: folktale.result.Ok.prototype.merge
category: Extracting values
---

Returns the value inside of the Result structure, regardless of its state.


## Example::

    const Result = require('folktale/result');
    
    Result.Ok(1).merge();
    // ==> 1
    
    Result.Error(1).merge();
    // ==> 1
