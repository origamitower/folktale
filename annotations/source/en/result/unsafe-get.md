@annotate: folktale.result.Error.prototype.unsafeGet
@annotate: folktale.result.Ok.prototype.unsafeGet
category: Extracting values
---

Extracts the value from a `Result` structure.

> **WARNING**  
> This method is partial, which means that it will only work for `Ok`
> structures, not for `Error` structures. It's recommended to use `.getOrElse()`
> or `.matchWith()` instead.

## Example::

    const Result = require('folktale/result');
    
    Result.Ok(1).unsafeGet();
    // ==> 1
    
    
    try {
      Result.Error(1).unsafeGet();
      // TypeError: Can't extract the value of an Error
    } catch (e) {
      e instanceof TypeError; // ==> true
    }
    
