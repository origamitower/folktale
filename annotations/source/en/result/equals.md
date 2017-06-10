@annotate: folktale.result.Error.prototype.equals
@annotate: folktale.result.Ok.prototype.equals
category: Comparing and testing
---

Performs a deep-comparison of two Result values for equality. See `adt/union/derivations/equality` for details.


## Example::

    const Result = require('folktale/result');

    Result.Ok(1).equals(Result.Ok(1));
    // ==> true

    Result.Error(1).equals(Result.Error(1));
    // ==> true

    Result.Ok(1).equals(Result.Error(1));
    // ==> false

    Result.Ok(Result.Ok(1)).equals(Result.Ok(Result.Ok(1)));
    // ==> true