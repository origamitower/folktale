@annotate: folktale.result.Error.hasInstance
category: Comparing and testing
---

Tests if an arbitrary value is a Error case of a Result instance.


## Example::

    const Result = require('folktale/result');

    Result.Error.hasInstance({ value: 1 });
    // ==> false

    Result.Error.hasInstance(Result.Error(1));
    // ==> true

    Result.Error.hasInstance(Result.Ok(1));
    // ==> false
