@annotate: folktale.result.fromMaybe
category: Converting from other types
---

A convenience method for the `folktale/conversions/maybe-to-result` module.

## Example::

    const Result = require('folktale/result');
    const Maybe = require('folktale/maybe');
    
    Result.fromMaybe(Maybe.Just(1), 'error');
    // ==> Result.Ok(1)
    
    Result.fromMaybe(Maybe.Nothing(), 'error');
    // ==> Result.Error('error')
