@annotate: folktale.data.future._Future.prototype.bimap
category: Transforming
---

Transforms both successful and failure values in a Future, without touching its state.


## Example::

    const { of, rejected } = require('folktale/data/future');

    const inc = (x) => x + 1;
    const dec = (x) => x - 1;

    of(1).bimap(inc, dec).listen({
      Resolved: (x) => $ASSERT(x == 0)
    });

    rejected(1).bimap(inc, dec).listen({
      Rejected: (x) => $ASSERT(x == 2)
    });
