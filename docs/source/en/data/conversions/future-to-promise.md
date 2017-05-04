@annotate: folktale.data.conversions.futureToPromise
category: Converting from Futures
---

Converts a Future into a Promise.

Note that this conversion may not be as accurate due to the differences in Promise and Future semantics. In particular, Promises recursively flatten any object with a `.then` method, and do not have a separate representation for cancellations.

Cancelled futures are converted to rejected promises with a special `Cancelled()` object.


## Example::

    const futureToPromise = require('folktale/data/conversions/future-to-promise');
    const Future = require('folktale/data/future');

    $ASSERT(
      (await futureToPromise(Future.of(1))) == 1
    );

    try {
      await futureToPromise(Future.rejected(1));
      throw 'never happens';
    } catch (e) {
      $ASSERT(e == 1)
    }
