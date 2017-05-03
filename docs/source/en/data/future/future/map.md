@annotate: folktale.data.future._Future.prototype.map
category: Transforming
---

Transforms the successful value of a Future, without touching its state.


## Example::

    const { of, rejected } = require('folktale/data/future');

    of(1).map(x => x + 1).listen({
      Resolved: (value) => $ASSERT(value == 2)
    });

    rejected(1).map(x => x + 1).listen({
      Rejected: (value) => $ASSERT(value == 1)
    });
