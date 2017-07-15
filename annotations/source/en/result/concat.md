@annotate: folktale.result.Ok.prototype.concat
@annotate: folktale.result.Error.prototype.concat
category: Combining
---

Combines two Results such that if they're both successful (`Ok`) their values are
concatenated. Otherwise returns the failure.

Note that values are expected to be Fantasy Land 1.x semigroups and implement a
`concat` method.


## Example::

    const Result = require('folktale/result');

    Result.Ok([1]).concat(Result.Ok([2]));
    // ==> Result.Ok([1, 2])

    Result.Ok([1]).concat(Result.Error([2]));
    // ==> Result.Error([2])

    Result.Error([1]).concat(Result.Error([2]));
    // ==> Result.Error([2])

    Result.Error([1]).concat(Result.Ok([2]));
    // ==> Result.Error([1])