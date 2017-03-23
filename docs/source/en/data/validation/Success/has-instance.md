@annotate: folktale.data.validation.Success.hasInstance
category: Comparing and testing
---

Tests if an arbitrary value is a Success case of a Validation instance.

## Example::

    const Validation = require('folktale/data/validation');

    Validation.Success.hasInstance({ value: 1 });
    // ==> false

    Validation.Success.hasInstance(Validation.Success(1));
    // ==> true

    Validation.Success.hasInstance(Validation.Failure(1));
    // ==> false