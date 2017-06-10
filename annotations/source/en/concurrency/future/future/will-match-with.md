@annotate: folktale.concurrency.future._Future.prototype.willMatchWith
category: Pattern Matching
---

Limited pattern matching for futures.


## Example::

    const { of, rejected } = require('folktale/concurrency/future');

    of(1).willMatchWith({
      Cancelled: () => of('no'),
      Rejected:  (x) => of(x + 1),
      Resolved:  (x) => of(x - 1)
    }).listen({
      onResolved: (x) => $ASSERT(x == 0)
    });


    rejected(1).willMatchWith({
      Cancelled: () => of('no'),
      Rejected:  (x) => of(x + 1),
      Resolved:  (x) => of(x - 1)
    }).listen({
      onResolved: (x) => $ASSERT(x == 2)
    })
