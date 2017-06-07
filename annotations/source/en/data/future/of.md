@annotate: folktale.data.future.of
category: Constructing
---

Constructs a Future holding a successful value.


## Example::

    const { of } = require('folktale/data/future');

    of(1).map(x => {
      $ASSERT(x == 1);
    });
