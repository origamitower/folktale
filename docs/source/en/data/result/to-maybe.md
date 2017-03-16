@annotate: folktale.data.result.toMaybe
category: Converting to other types
---

Transforms a Result into a Maybe. Error values are lost in the process.


## Example::

    const Result = require('folktale/data/result');
    const Maybe = require('folktale/data/maybe');
    
    Result.Ok(1).toMaybe();
    // ==> Maybe.Just(1)
    
    Result.Error(1).toMaybe();
    // ==> Maybe.Nothing()
