@annotate: folktale.data.future._Future.prototype.chain
category: Transforming
---

Transforms a Future's successful value along with its state.


## Example::

    const { of, rejected } = require('folktale/data/future');

    of(1).chain(x => of(x + 1)).listen({
      Resolved: (value) => $ASSERT(value == 2)
    });

    of(1).chain(x => rejected(x)).listen({
      Rejected: (reason) => $ASSERT(reason == 1)
    });

    rejected(1).chain(x => of(x + 1)).listen({
      Rejected: (reason) => $ASSERT(reason == 1)
    });
