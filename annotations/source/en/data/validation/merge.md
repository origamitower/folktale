@annotate: folktale.data.validation.Failure.prototype.merge
@annotate: folktale.data.validation.Success.prototype.merge
category: Extracting values
---

Returns the value inside of the Validation structure, regardless of its state.

## Example::

    const { Success, Failure } = require('folktale/data/validation');

    Success('a').merge();
    // ==> 'a'

    Failure('a').merge();
    // ==> 'a'