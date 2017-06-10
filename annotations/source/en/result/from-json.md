@annotate: folktale.result.fromJSON
category: Serialising
---

Parses a JavaScript object previously serialised as `aResult.toJSON()` into a proper Result structure.

See the docs for `adt/union/derivations/serialization` for more details.


## Example::

    const Result = require('folktale/result');

    Result.fromJSON(Result.Ok(1).toJSON());
    // ==> Result.Ok(1)

    Result.fromJSON(Result.Error(1).toJSON());
    // ==> Result.Error(1)