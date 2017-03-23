@annotate: folktale.data.validation.of
category: Constructing
---

Constructs a Validation holding a Success value.

## Example::

    const Validation = require('folktale/data/validation');

    Validation.of(1);
    // ==> Validation.Success(1)