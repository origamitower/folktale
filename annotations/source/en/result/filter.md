@annotate: folktale.result.Error.prototype.filter
@annotate: folktale.result.Ok.prototype.filter
category: Transforming
---

If the Result is a Ok, passes its value to the predicate. If the predicate
returns true, then the Result is returned unchanged. In every other case,
an Error gets returned.

## Example::

    const Result = require('folktale/result');

    // This line evaluates to true.
    Result.Ok.hasInstance(Result.Ok(3).filter(n => n === 3));

    // These lines evaluates to false.
    Result.Ok.hasInstance(Result.Ok(2).filter(n => n === 3));
    Result.Ok.hasInstance(Result.Error(3).filter(n => n !== 3));
    Result.Ok.hasInstance(Result.Error(3).filter(n => n === 3));
