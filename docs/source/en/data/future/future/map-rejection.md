@annotate: folktale.data.future._Future.prototype.mapRejection
category: Transforming
---

Transforms failure values in a Future without touching its state.


## Example::

    const { of, rejected } = require('folktale/data/future');


    of(1).mapRejected(x => x + 1).listen({
      Resolved: (x) => $ASSERT(x == 1)
    });

    rejected(1).mapRejected(x => x + 1).listen({
      Rejected: (x) => $ASSERT(x == 2)
    });
