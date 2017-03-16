@annotate: folktale.data.maybe.Nothing.prototype.map
@annotate: folktale.data.maybe.Just.prototype.map
category: Transforming
---

Transforms the value inside a Maybe structure with an unary function. Only
transforms values that are successful (`Just`), and constructs a new Maybe as a
result.

## Example::

    const Maybe = require('folktale/data/maybe');
    
    function increment(value) {
      return value + 1;
    }
    
    Maybe.Just(1).map(increment);
    // ==> Maybe.Just(2)
    
    Maybe.Nothing().map(increment);
    // ==> Maybe.Nothing()
