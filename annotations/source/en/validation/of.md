@annotate: folktale.validation.of
category: Constructing
---

Constructs a Validation holding a Success value.

## Example::

    const Validation = require('folktale/validation');

    Validation.of(1);
    // ==> Validation.Success(1)