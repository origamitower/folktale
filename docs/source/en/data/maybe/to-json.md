@annotate: folktale.data.maybe.Just.prototype.toJSON
@annotate: folktale.data.maybe.Nothing.prototype.toJSON
category: Serialising
---

Converts a Maybe value to a JavaScript object that may be stored as a JSON value.

See the docs for `core/adt/derivations/serialization` for more details.


## Example::

    const Maybe = require('folktale/data/maybe');

    Maybe.Just(1).toJSON();
    // ==> { '@@type': 'folktale:Data.Maybe', '@@tag': 'Just', '@@value': { value: 1 } }

    Maybe.Nothing().toJSON();
    // ==> { '@@type': 'folktale:Data.Maybe', '@@tag': 'Nothing', '@@value': {} }