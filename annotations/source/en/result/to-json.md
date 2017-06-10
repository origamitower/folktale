@annotate: folktale.result.Ok.prototype.toJSON
@annotate: folktale.result.Error.prototype.toJSON
category: Serialising
---

Converts a Result value to a JavaScript object that may be stored as a JSON value.

See the docs for `adt/union/derivations/serialization` for more details.


## Example::

    const Result = require('folktale/result');

    Result.Ok(1).toJSON();
    // ==> { '@@type': 'folktale:Result', '@@tag': 'Ok', '@@value': { value: 1 } }

    Result.Error(1).toJSON();
    // ==> { '@@type': 'folktale:Result', '@@tag': 'Error', '@@value': { value: 1 } }

    Result.Error(undefined).toJSON();
    // ==> { '@@type': 'folktale:Result', '@@tag': 'Error', '@@value': { value: null } }
