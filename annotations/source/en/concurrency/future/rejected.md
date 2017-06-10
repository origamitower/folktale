@annotate: folktale.concurrency.future.rejected
category: Constructing
---

Constructs a future holding a failure value.


## Example::

    const { rejected } = require('folktale/concurrency/future');

    rejected(1).mapRejected(x => {
      $ASSERT(x == 1);
    });
