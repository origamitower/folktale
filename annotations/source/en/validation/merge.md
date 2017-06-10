@annotate: folktale.validation.Failure.prototype.merge
@annotate: folktale.validation.Success.prototype.merge
category: Extracting values
---

Returns the value inside of the Validation structure, regardless of its state.

## Example::

    const { Success, Failure } = require('folktale/validation');

    Success('a').merge();
    // ==> 'a'

    Failure('a').merge();
    // ==> 'a'