@annotate: folktale.data.result.Ok.prototype.toJSON
@annotate: folktale.data.result.Error.prototype.toJSON
category: Serialising
---

Converts a Result value to a JavaScript object that may be stored as a JSON value.

See the docs for `core/adt/derivations/serialization` for more details.


## Example::

    const Result = require('folktale/data/result');

    Result.Ok(1).toJSON();
    // ==> { '@@type': 'folktale:Data.Result', '@@tag': 'Ok', '@@value': { value: 1 } }

    Result.Error(1).toJSON();
    // ==> { '@@type': 'folktale:Data.Result', '@@tag': 'Error', '@@value': { value: 1 } }

    Result.Error(undefined).toJSON();
    // ==> { '@@type': 'folktale:Data.Result', '@@tag': 'Error', '@@value': { value: null } }
