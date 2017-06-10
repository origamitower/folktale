@annotate: folktale.concurrency.future.of
category: Constructing
---

Constructs a Future holding a successful value.


## Example::

    const { of } = require('folktale/concurrency/future');

    of(1).map(x => {
      $ASSERT(x == 1);
    });
