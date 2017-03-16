@annotate: folktale.data.result.Error.prototype.merge
@annotate: folktale.data.result.Ok.prototype.merge
category: Extracting values
---

Returns the value inside of the Result structure, regardless of its state.


## Example::

    const Result = require('folktale/data/result');
    
    Result.Ok(1).merge();
    // ==> 1
    
    Result.Error(1).merge();
    // ==> 1
