@annotate: folktale.data.conversions.promiseToFuture
category: Converting from Promises
---

Converts a Promise to a folktale Future.

Note that this conversion may not be as accurate due to the differences in Promise and Future semantics. In particular, Promises recursively flatten any object with a `.then` method, and do not have a separate representation for cancellations.

If a Promise contains a rejection with Folktale's special `Cancelled()` value, then the resulting Future will be a cancelled Future rather than a rejected one.


## Example::

    const promiseToFuture = require('folktale/data/conversions/promise-to-future');

    promiseToFuture(Promise.resolve(1));
    // => Future.resolve(1)

    promiseToFuture(Promise.reject(1));
    // => Future.reject(1)

