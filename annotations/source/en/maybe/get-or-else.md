@annotate: folktale.maybe.Nothing.prototype.getOrElse
@annotate: folktale.maybe.Just.prototype.getOrElse
category: Extracting values
---

Extracts the value of a Maybe structure, if it exists (i.e.: is a `Just`),
otherwise returns the provided default value.

## Example::

    const Maybe = require('folktale/maybe');

    Maybe.Just(1).getOrElse(2);   // ==> 1
    Maybe.Nothing().getOrElse(2); // ==> 2
