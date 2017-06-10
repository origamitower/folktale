@annotate: folktale.validation.Failure.prototype.matchWith
@annotate: folktale.validation.Success.prototype.matchWith
category: Pattern matching
---

Chooses and executes a function for each variant in the Validation structure.


## Example::

    const { Success, Failure } = require('folktale/validation');

    Success('a').matchWith({
      Failure: ({ value }) => `Failure: ${value}`,
      Success: ({ value }) => `Success: ${value}`
    });
    // ==> 'Success: a'

    Failure('a').matchWith({
      Failure: ({ value }) => `Failure: ${value}`,
      Success: ({ value }) => `Success: ${value}`
    });
    // ==> 'Failure: a'