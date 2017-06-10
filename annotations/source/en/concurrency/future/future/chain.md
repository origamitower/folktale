@annotate: folktale.concurrency.future._Future.prototype.chain
category: Transforming
---

Transforms a Future's successful value along with its state.


## Example::

    const { of, rejected } = require('folktale/concurrency/future');

    of(1).chain(x => of(x + 1)).listen({
      onResolved: (value) => $ASSERT(value == 2)
    });

    of(1).chain(x => rejected(x)).listen({
      onRejected: (reason) => $ASSERT(reason == 1)
    });

    rejected(1).chain(x => of(x + 1)).listen({
      onRejected: (reason) => $ASSERT(reason == 1)
    });
