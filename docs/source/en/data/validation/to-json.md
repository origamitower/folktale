@annotate: folktale.data.validation.Failure.prototype.toJSON
@annotate: folktale.data.validation.Success.prototype.toJSON
category: Serialising
---

Converts a Validation value to a JavaScript object that may be stored as a JSON value.

See the docs for `core/adt/derivations/serialization` for more details.


## Example::

    const { Success, Failure } = require('folktale/data/validation');

    Success('a').toJSON();
    // ==> { '@@type': 'folktale:Data.Validation', '@@tag': 'Success', '@@value': { value: 'a' }}

    Failure('a').toJSON();
    // ==> { '@@type': 'folktale:Data.Validation', '@@tag': 'Failure', '@@value': { value: 'a' }}