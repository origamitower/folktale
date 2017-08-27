@annotate: folktale.concurrency.future._Future.prototype.orElse
category: Recovering From Errors
---

Transforms a failed future into a new future.


## Example::

    const { rejected, of } = require('folktale/concurrency/future');

    of(1).orElse(x => of(x + 1)).listen({
      onResolved: (value) => $ASSERT(value == 1)
    });

    rejected(1).orElse(x => of(x + 1)).listen({
      onResolved: (value) => $ASSERT(value == 2)
    });

    rejected(1).orElse(x => rejected(x + 1)).listen({
      onRejected: (value) => $ASSERT(value == 2)
    });
