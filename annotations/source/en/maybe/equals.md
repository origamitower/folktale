@annotate: folktale.maybe.Just.prototype.equals
@annotate: folktale.maybe.Nothing.prototype.equals
category: Comparing and testing
---

Performs a deep-comparison of two Maybe values for equality. See `adt/union/derivations/equality` for details.


## Example::

    const Maybe = require('folktale/maybe');

    Maybe.Just(1).equals(Maybe.Just(1));
    // ==> true

    Maybe.Just(1).equals(Maybe.Nothing());
    // ==> false

    Maybe.Nothing().equals(Maybe.Nothing());
    // ==> true

    Maybe.Just(Maybe.Just(1)).equals(Maybe.Just(Maybe.Just(1)));
    // ==> true