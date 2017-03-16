@annotate: folktale.data.maybe.Just.hasInstance
category: Comparing and testing
---

Tests if an arbitrary value is a Just case of a Maybe instance.


## Example::


    const Maybe = require('folktale/data/maybe');

    Maybe.Just.hasInstance({ value: 1 });
    // ==> false

    Maybe.Just.hasInstance(Maybe.Just(1));
    // ==> true

    Maybe.Just.hasInstance(Maybe.Nothing());
    // ==> false