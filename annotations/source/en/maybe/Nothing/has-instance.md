@annotate: folktale.maybe.Nothing.hasInstance
category: Comparing and testing
---

Tests if an arbitrary value is a Nothing case of a Maybe instance.


## Example::


    const Maybe = require('folktale/maybe');

    Maybe.Nothing.hasInstance(Maybe.Just(1));
    // ==> false

    Maybe.Nothing.hasInstance(Maybe.Nothing());
    // ==> true