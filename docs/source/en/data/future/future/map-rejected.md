@annotate: folktale.data.future._Future.prototype.mapRejected
category: Transforming
---

Transforms failure values in a Future without touching its state.


## Example::

    const { of, rejected } = require('folktale/data/future');


    of(1).mapRejected(x => x + 1).listen({
      onResolved: (x) => $ASSERT(x == 1)
    });

    rejected(1).mapRejected(x => x + 1).listen({
      onRejected: (x) => $ASSERT(x == 2)
    });
