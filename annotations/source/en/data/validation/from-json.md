@annotate: folktale.data.validation.fromJSON
category: Serialising
---

Parses a JavaScript object previously serialised as `aValidation.toJSON()` into a proper Validation structure.

See the docs for `core/adt/derivations/serialization` for more details.


## Example::

    const Validation = require('folktale/data/validation');

    Validation.fromJSON(Validation.Success(1).toJSON());
    // ==> Validation.Success(1)

    Validation.fromJSON(Validation.Failure(1).toJSON());
    // ==> Validation.Failure(1)