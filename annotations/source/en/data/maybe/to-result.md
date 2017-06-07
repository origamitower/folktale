@annotate: folktale.data.maybe.Just.prototype.toResult
@annotate: folktale.data.maybe.Nothing.prototype.toResult
category: Converting to other types
---

A convenience method for the `folktale/data/conversions/maybe-to-result` module.

## Example::

    const Maybe = require('folktale/data/maybe');
    const Result = require('folktale/data/result');

    Maybe.Just(1).toResult(0);
    // ==> Result.Ok(1)

    Maybe.Nothing().toResult(0)
    // ==> Result.Error(0)

