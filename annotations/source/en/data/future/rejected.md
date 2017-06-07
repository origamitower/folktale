@annotate: folktale.data.future.rejected
category: Constructing
---

Constructs a future holding a failure value.


## Example::

    const { rejected } = require('folktale/data/future');

    rejected(1).mapRejected(x => {
      $ASSERT(x == 1);
    });
