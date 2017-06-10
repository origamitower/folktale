@annotate: folktale.concurrency.future._Future.prototype.bimap
category: Transforming
---

Transforms both successful and failure values in a Future, without touching its state.


## Example::

    const { of, rejected } = require('folktale/concurrency/future');

    const inc = (x) => x + 1;
    const dec = (x) => x - 1;

    of(1).bimap(inc, dec).listen({
      onResolved: (x) => $ASSERT(x == 0)
    });

    rejected(1).bimap(inc, dec).listen({
      onRejected: (x) => $ASSERT(x == 2)
    });
