@annotate: folktale.concurrency.future._Future.prototype.toPromise
category: Converting to other types
---

Converts a Future into a Promise.

Note that this conversion may not be as accurate due to the differences in Promise and Future semantics. In particular, Promises recursively flatten any object with a `.then` method, and do not have a separate representation for cancellations.

Cancelled futures are converted to rejected promises with a special `Cancelled()` object.


## Example::

    const Future = require('folktale/concurrency/future');

    $ASSERT(
      (await Future.of(1).toPromise()) == 1
    );

    try {
      await Future.rejected(1).toPromise();
      throw 'never happens';
    } catch (e) {
      $ASSERT(e == 1)
    }
