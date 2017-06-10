@annotate: folktale.maybe.Just.prototype.toResult
@annotate: folktale.maybe.Nothing.prototype.toResult
category: Converting to other types
---

A convenience method for the `folktale/conversions/maybe-to-result` module.

## Example::

    const Maybe = require('folktale/maybe');
    const Result = require('folktale/result');

    Maybe.Just(1).toResult(0);
    // ==> Result.Ok(1)

    Maybe.Nothing().toResult(0)
    // ==> Result.Error(0)

