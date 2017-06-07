@annotate: folktale.data.maybe.Nothing.prototype.apply
@annotate: folktale.data.maybe.Just.prototype.apply
category: Transforming
---

Transforms a Maybe value using a function contained in another Maybe. As with
`.map()`, the Maybe values are expected to be `Just`, and no operation is
performed if any of them is a `Nothing`.


## Example::

    const Maybe = require('folktale/data/maybe');
    
    function increment(value) {
      return value + 1;
    }
    
    Maybe.Just(increment).apply(Maybe.Just(1));
    // ==> Maybe.Just(2)
    
    Maybe.Just(increment).apply(Maybe.Nothing());
    // ==> Maybe.Nothing()
    
    Maybe.Nothing().apply(Maybe.Just(1));
    // ==> Maybe.Nothing()
