@annotate: folktale.concurrency.future.fromPromise
category: Converting from other types
---

Converts a Promise to a folktale Future.

Note that this conversion may not be as accurate due to the differences in Promise and Future semantics. In particular, Promises recursively flatten any object with a `.then` method, and do not have a separate representation for cancellations.

If a Promise contains a rejection with Folktale's special `Cancelled()` value, then the resulting Future will be a cancelled Future rather than a rejected one.


## Example::

    const { fromPromise } = require('folktale/concurrency/future');

    fromPromise(Promise.resolve(1));
    // => Future.resolve(1)

    fromPromise(Promise.reject(1));
    // => Future.reject(1)

