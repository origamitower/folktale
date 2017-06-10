@annotate: folktale.result.Ok.prototype.toMaybe
@annotate: folktale.result.Error.prototype.toMaybe
category: Converting to other types
---

Transforms a Result into a Maybe. Error values are lost in the process.


## Example::

    const Result = require('folktale/result');
    const Maybe = require('folktale/maybe');
    
    Result.Ok(1).toMaybe();
    // ==> Maybe.Just(1)
    
    Result.Error(1).toMaybe();
    // ==> Maybe.Nothing()
