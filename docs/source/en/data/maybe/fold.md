@annotate: folktale.data.maybe.Just.prototype.fold
@annotate: folktale.data.maybe.Nothing.prototype.fold
category: Pattern matching
---

Applies a function to each variant of the Maybe structure.


## Example::

    const Maybe = require('folktale/data/maybe');

    Maybe.Just(1).fold(
      (()  => 'nothing'),
      ((v) => `got ${v}`)
    );
    // ==> 'got 1'

    Maybe.Nothing().fold(
      (()  => 'nothing'),
      ((v) => `got ${v}`)
    );
    // ==> 'nothing'