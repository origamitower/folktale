@annotate: folktale.maybe.Nothing.prototype.filter
@annotate: folktale.maybe.Just.prototype.filter
category: Transforming
---

If the Maybe is a Just, passes its value to the predicate. If the predicate
returns true, then the Maybe is returned unchanged. In every other case,
a Nothing gets returned.

## Example::

    const Maybe = require('folktale/maybe');

    // This line evaluates to true.
    Maybe.Just.hasInstance(Maybe.Just(3).filter(n => n === 3));

    // These lines evaluate to false.
    Maybe.Just.hasInstance(Maybe.Just(2).filter(n => n === 3));
    Maybe.Just.hasInstance(Maybe.Nothing().filter(n => n !== 3));
    Maybe.Just.hasInstance(Maybe.Nothing().filter(n => n === 3));

