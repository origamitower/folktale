@annotate: folktale.maybe.fromNullable
category: Converting from other types
---

A convenience method for the `folktale/conversions/nullable-to-maybe` module.

## Example::

    const Maybe = require('folktale/maybe');
    
    Maybe.fromNullable(1);
    // ==> Maybe.Just(1)
    
    Maybe.fromNullable(null);
    // ==> Maybe.Nothing()
    
    Maybe.fromNullable(undefined);
    // ==> Maybe.Nothing()
