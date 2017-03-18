@annotate: folktale.data.result.Ok.hasInstance
category: Comparing and testing
---

Tests if an arbitrary value is a Ok case of a Result instance.


## Example::

    const Result = require('folktale/data/result');

    Result.Ok.hasInstance({ value: 1 });
    // ==> false

    Result.Ok.hasInstance(Result.Error(1));
    // ==> false

    Result.Ok.hasInstance(Result.Ok(1));
    // ==> true
