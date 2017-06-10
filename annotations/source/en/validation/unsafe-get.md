@annotate: folktale.validation.Failure.prototype.unsafeGet
@annotate: folktale.validation.Success.prototype.unsafeGet
category: Extracting values
---

Extracts the value from a `Validation` structure.

> **WARNING**  
> This method is partial, which means that it will only work for `Success`
> structures, not for `Failure` structures. It's recommended to use `.getOrElse()`
> or `.matchWith()` instead.

## Example::

    const { Failure, Success } = require('folktale/validation');
    
    Success('a').unsafeGet();
    // ==> 'a'
    
    
    try {
      Failure('a').unsafeGet();
      // TypeError: Can't extract the value of an Error
    } catch (e) {
      e instanceof TypeError; // ==> true
    }
    
