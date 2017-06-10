@annotate: folktale.maybe.hasInstance
category: Comparing and testing
---

Tests if an arbitrary value is a Maybe instance.


## Example::

    const Maybe = require('folktale/maybe');

    Maybe.hasInstance({ value: 1 });
    // ==> false

    Maybe.hasInstance(Maybe.Just(1));
    // ==> true