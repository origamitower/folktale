@annotate: folktale.result.Error.prototype.getOrElse
@annotate: folktale.result.Ok.prototype.getOrElse
category: Extracting values
---

Extracts the value of a `Result` structure, if it exists (i.e.: is an `Ok`),
otherwise returns the provided default value.


## Example::

    const Result = require('folktale/result');
    
    Result.Ok(1).getOrElse(2);
    // ==> 1
    
    Result.Error(1).getOrElse(2);
    // ==> 2
