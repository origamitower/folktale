@annotate: folktale.concurrency.task._TaskExecution.prototype.promise
category: Extracting eventual values
---

Gets the eventual value of the task as a JavaScript's `Promise`.

Since Promises don't have support for representing cancellations, Folktale's
tasks represent cancellation as a rejection with a special object. See the
documentation for Futures and Deferreds for more details.


## Example::

    const { task, of, rejected } = require('folktale/concurrency/task');
    
    const result1 = await of(1).run().promise();
    $ASSERT(result1 == 1);
    
    try {
      const result2 = await rejected(1).run().promise();
      throw 'never happens';
    } catch (error) {
      $ASSERT(error == 1);
    }
    
    try {
      const result3 = await task(r => r.cancel()).run().promise();
      throw 'never happens';
    } catch (error) {
      const { Cancelled } = require('folktale/concurrency/future/_execution-state');
      $ASSERT(Cancelled.hasInstance(error));
    }
