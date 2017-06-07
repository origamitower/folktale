@annotate: folktale.data.validation.Failure.prototype.equals
@annotate: folktale.data.validation.Success.prototype.equals
category: Comparing and testing
---

Performs a deep-comparison of two Validation values for equality.

See `core/adt/derivations/equality` for details.


## Example::

    const { Success, Failure } = require('folktale/data/validation');

    Success(1).equals(Success(1));
    // ==> true

    Failure(1).equals(Failure(1));
    // ==> true

    Success(1).equals(Failure(1));
    // ==> false

    Success(Success(1)).equals(Success(Success(1)));
    // ==> true
