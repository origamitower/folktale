@annotate: folktale.maybe.Just.prototype.concat
@annotate: folktale.maybe.Nothing.prototype.concat
category: Combining
---

Combines two maybes such that if they both have values (are a `Just`) their values
are concatenated. Maybe values are expected to be Fantasy Land 1.x semigroups and
implement a `concat` method.


## Example::

    const Maybe = require('folktale/maybe');

    Maybe.Just([1]).concat(Maybe.Just([2]));
    // ==> Maybe.Just([1, 2])

    Maybe.Just([1]).concat(Maybe.Nothing());
    // ==> Maybe.Just([1])

    Maybe.Nothing().concat(Maybe.Nothing());
    // ==> Maybe.Nothing()