@annotate: folktale.data.result.fromMaybe
category: Converting from other types
---

A convenience method for the `folktale/data/conversions/maybe-to-result` module.

## Example::

    const Result = require('folktale/data/result');
    const Maybe = require('folktale/data/maybe');
    
    Result.fromMaybe(Maybe.Just(1), 'error');
    // ==> Result.Ok(1)
    
    Result.fromMaybe(Maybe.Nothing(), 'error');
    // ==> Result.Error('error')
