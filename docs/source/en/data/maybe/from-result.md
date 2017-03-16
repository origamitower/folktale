@annotate: folktale.data.maybe.fromResult
category: Converting from other types
---

A convenience method for the `folktale/data/conversions/result-to-maybe` module.

Note that `Error` values are discarded, since `Nothing` can't hold a value.


## Example::

    const Maybe = require('folktale/data/maybe');
    const Result = require('folktale/data/result');
    
    Maybe.fromResult(Result.Ok(1));
    // ==> Maybe.Just(1)
    
    Maybe.fromResult(Result.Error(1));
    // ==> Maybe.Nothing()
