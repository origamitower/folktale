@annotate: folktale.result.fromNullable
category: Converting from other types
---

A convenience method for the `folktale/conversions/nullable-to-result`
module.

## Example::

    const Result = require('folktale/result');

    Result.fromNullable(1);
    // ==> Result.Ok(1)

    Result.fromNullable(null, 'error');
    // ==> Result.Error('error')

    Result.fromNullable(undefined, 'error');
    // ==> Result.Error('error')
