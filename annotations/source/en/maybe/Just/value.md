@annotate: Object.getOwnPropertyDescriptor(folktale.maybe.Just.prototype, 'value').get
category: Data fields
---

The value contained in a Just instance of the Maybe structure.

This is usually used to destructure the instance in a `.matchWith` call.

## Example::

    const Maybe = require('folktale/maybe');

    Maybe.Just(1).matchWith({
      Just: ({ value }) => value, // equivalent to (x) => x.value
      Nothing: () => 'nothing'
    });
    // ==> 1