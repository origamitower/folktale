@annotate: folktale.result.fromNullable
category: Converting from other types
---

A convenience method for the `folktale/conversions/nullable-to-result`
module.

## Example::

    const Result = require('folktale/result');
    
    Result.fromNullable(1);
    // ==> Result.Ok(1)
    
    Result.fromNullable(null);
    // ==> Result.Error(null)
    
    Result.fromNullable(undefined);
    // ==> Result.Error(undefined)
