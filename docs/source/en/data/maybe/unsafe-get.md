@annotate: folktale.data.maybe.Nothing.prototype.unsafeGet
@annotate: folktale.data.maybe.Just.prototype.unsafeGet
category: Extracting values
---

Extracts the value from a `Just` structure.

> **WARNING**  
> This method is partial, which means that it will only work for
> `Just` structures, not for `Nothing` structures. It's recommended
> to use `.getOrElse()` or `.matchWith()` instead.

## Example::

    const Maybe = require('folktale/data/maybe');

    Maybe.Just(1).unsafeGet(); // ==> 1

    try {
      Maybe.Nothing().unsafeGet();
      // TypeError: Can't extract the value of a Nothing
    } catch (e) {
      e instanceof TypeError; // ==> true
    }
