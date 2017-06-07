@annotate: folktale.data.result.Ok.prototype.matchWith
@annotate: folktale.data.result.Error.prototype.matchWith
category: Pattern matching
---

Chooses and executes a function for each variant in the Result structure.


## Example::

    const Result = require('folktale/data/result');

    Result.Ok(1).matchWith({
      Ok: ({ value }) => `ok ${value}`,
      Error: ({ value }) => `error ${value}`
    });
    // ==> 'ok 1'

    Result.Error(1).matchWith({
      Ok: ({ value }) => `ok ${value}`,
      Error: ({ value }) => `error ${value}`
    });
    // ==> 'error 1'