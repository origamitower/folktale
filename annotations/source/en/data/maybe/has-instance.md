@annotate: folktale.data.maybe.hasInstance
category: Comparing and testing
---

Tests if an arbitrary value is a Maybe instance.


## Example::

    const Maybe = require('folktale/data/maybe');

    Maybe.hasInstance({ value: 1 });
    // ==> false

    Maybe.hasInstance(Maybe.Just(1));
    // ==> true