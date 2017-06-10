@annotate: folktale.maybe.fromJSON
category: Serialising
---

Parses a JavaScript object previously serialised as `aMaybe.toJSON()` into a proper Maybe structure.

See the docs for `adt/union/derivations/serialization` for more details.


## Example::

    const Maybe = require('folktale/maybe');

    Maybe.fromJSON(Maybe.Just(1).toJSON());
    // ==> Maybe.Just(1)

    Maybe.fromJSON(Maybe.Nothing().toJSON());
    // ==> Maybe.Nothing()

