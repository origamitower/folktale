@annotate: folktale.maybe.Just.prototype.matchWith
@annotate: folktale.maybe.Nothing.prototype.matchWith
category: Pattern matching
---

Chooses and executes a function for each variant in the Maybe structure.


## Example::

    const Maybe = require('folktale/maybe');

    Maybe.Just(1).matchWith({
      Nothing: () => 'nothing',
      Just: ({ value }) => `got ${value}`
    });
    // ==> 'got 1'

    Maybe.Nothing().matchWith({
      Nothing: () => 'nothing',
      Just: ({ value }) => `got ${value}`
    });
    // ==> 'nothing'