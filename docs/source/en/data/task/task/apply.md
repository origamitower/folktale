@annotate: folktale.data.task._Task.prototype.apply
category: Transforming tasks
---

Applies the function in the left task to the value on the right task. The left
task is ran to completion before the right task is started.

Note that the right task isn't ran if the left task contains a failure.

If any of the tasks fail, the result will be that failure. Likewise, if any of
the tasks is cancelled, the result will be that cancellation.


## Example::

    const { of, rejected } = require('folktale/data/task');
    
    const result1 = await of(x => x + 1).apply(of(1)).run().promise();
    $ASSERT(result1 == 2);
    
    try {
      const result2 = await of(x => x + 1).apply(rejected(1)).run().promise();
      throw 'never happens';
    } catch (error) {
      $ASSERT(error == 1);
    }
