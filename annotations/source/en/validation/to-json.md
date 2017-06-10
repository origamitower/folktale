@annotate: folktale.validation.Failure.prototype.toJSON
@annotate: folktale.validation.Success.prototype.toJSON
category: Serialising
---

Converts a Validation value to a JavaScript object that may be stored as a JSON value.

See the docs for `adt/union/derivations/serialization` for more details.


## Example::

    const { Success, Failure } = require('folktale/validation');

    Success('a').toJSON();
    // ==> { '@@type': 'folktale:Validation', '@@tag': 'Success', '@@value': { value: 'a' }}

    Failure('a').toJSON();
    // ==> { '@@type': 'folktale:Validation', '@@tag': 'Failure', '@@value': { value: 'a' }}