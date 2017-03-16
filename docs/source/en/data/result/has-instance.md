@annotate: folktale.data.result.hasInstance
category: Comparing and testing
---

Tests if an arbitrary value is a Result instance.


## Example::

    const Result = require('folktale/data/result');

    Result.hasInstance({ value: 1 });
    // ==> false

    Result.hasInstance(Result.Ok(1));
    // ==> true

    Result.hasInstance(Result.Error(1));
    // ==> true