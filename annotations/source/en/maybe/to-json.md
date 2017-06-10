@annotate: folktale.maybe.Just.prototype.toJSON
@annotate: folktale.maybe.Nothing.prototype.toJSON
category: Serialising
---

Converts a Maybe value to a JavaScript object that may be stored as a JSON value.

See the docs for `adt/union/derivations/serialization` for more details.


## Example::

    const Maybe = require('folktale/maybe');

    Maybe.Just(1).toJSON();
    // ==> { '@@type': 'folktale:Maybe', '@@tag': 'Just', '@@value': { value: 1 } }

    Maybe.Nothing().toJSON();
    // ==> { '@@type': 'folktale:Maybe', '@@tag': 'Nothing', '@@value': {} }