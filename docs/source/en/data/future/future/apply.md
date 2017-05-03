@annotate: folktale.data.future._Future.prototype.apply
category: Transforming
---

Transforms the succesful value of a future by using a function stored in another future.


## Example::

    const { of, rejected } = require('folktale/data/future');

    const inc = (x) => x + 1;

    of(inc).apply(of(1)).listen({
      Resolved: (value) => $ASSERT(value == 2)
    });

    rejected(inc).apply(of(1)).listen({
      Rejected: (reason) => $ASSERT(reason === inc)
    });

    of(inc).apply(rejected(1)).listen({
      Rejected: (reason) => $ASSERT(reason == 1)
    });
