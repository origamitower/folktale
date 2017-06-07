@annotate: folktale.data.maybe.Nothing.prototype.chain
@annotate: folktale.data.maybe.Just.prototype.chain
category: Transforming
---

Transforms an entire Maybe structure with the provided function. As with
`.map()`, the transformation is only applied if the value is a `Just`, but
unlike `.map()` the transformation is expected to return a new `Maybe` value.

Having the transformation function return a new Maybe value means that the
transformation may fail, and the failure is appropriately propagated. In this
sense, `a.chain(f)` works similarly to the sequencing of statements done by the
`;` syntax in JavaScript — the next instruction only runs if the previous
instruction succeeds, and either instructions may fail.


## Example::

    const Maybe = require('folktale/data/maybe');
    
    function first(list) {
      return list.length > 0 ?  Maybe.Just(list[0])
      :      /* otherwise */    Maybe.Nothing();
    }
    
    first([]).chain(first);
    // ==> Maybe.Nothing()
    
    first([[1]]).chain(first);
    // ==> Maybe.Just(1)
    
    first([[]]).chain(first);
    // ==> Maybe.Nothing()
