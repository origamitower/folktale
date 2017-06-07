@annotate: folktale.data.validation.Failure.hasInstance
category: Comparing and testing
---

Tests if an arbitrary value is a Failure case of a Validation instance.

## Example::

    const Validation = require('folktale/data/validation');

    Validation.Failure.hasInstance({ value: 1 });
    // ==> false

    Validation.Failure.hasInstance(Validation.Success(1));
    // ==> false

    Validation.Failure.hasInstance(Validation.Failure(1));
    // ==> true