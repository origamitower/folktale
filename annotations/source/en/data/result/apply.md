@annotate: folktale.data.result.Error.prototype.apply
@annotate: folktale.data.result.Ok.prototype.apply
category: Transforming
---

Applies the function contained in one Result to the value in another Result.
Application only occurs if both Results are `Ok`, otherwise keeps the first
`Error`.

Note that `Result.Ok(x => x + 1).apply(Result.Ok(1))` is equivalent to
`Result.Ok(1).map(x => x + 1)`.


## Example::

    const Result = require('folktale/data/result');
    
    function increment(value) {
      return value + 1;
    }
    
    Result.Ok(increment).apply(Result.Ok(1));
    // ==> Result.Ok(2)
    
    Result.Ok(increment).apply(Result.Error(1));
    // ==> Result.Error(1)
    
    Result.Error(increment).apply(Result.Ok(1));
    // ==> Result.Error(increment)
    
    Result.Error(increment).apply(Result.Error(1));
    // ==> Result.Error(increment)
