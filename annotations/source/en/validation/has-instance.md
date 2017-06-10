@annotate: folktale.validation.hasInstance
category: Comparing and testing
---

Tests if an arbitrary value is a Validation instance.


## Example::

    const Validation = require('folktale/validation');

    Validation.hasInstance({ value: 1 });
    // ==> false

    Validation.hasInstance(Validation.Success(1));
    // ==> true

    Validation.hasInstance(Validation.Failure(1));
    // ==> true