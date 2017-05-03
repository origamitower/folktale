@annotate: folktale.data.future._Future.prototype.willMatchWith
category: Pattern Matching
---

Limited pattern matching for futures.


## Example::

    const { of, rejected } = require('folktale/data/future');

    of(1).willMatchWith({
      Cancelled: () => of('no'),
      Rejected:  (x) => of(x + 1),
      Resolved:  (x) => of(x - 1)
    }).listen({
      Resolved: (x) => $ASSERT(x == 0)
    });


    rejected(1).willMatchWith({
      Cancelled: () => of('no'),
      Rejected:  (x) => of(x + 1),
      Resolved:  (x) => of(x - 1)
    }).listen({
      Resolved: (x) => $ASSERT(x == 2)
    })
