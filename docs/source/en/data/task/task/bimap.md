@annotate: folktale.data.task._Task.prototype.bimap
category: Transforming tasks
---

Transforms the rejected or resolved values of a Task with a function. The state of the task is not changed.


## Example::

    const { of, rejected } = require('folktale/data/task');
    
    const result1 = await of(1).bimap(
      (error) => error + 1,
      (success) => success - 1
    ).run().promise();
    $ASSERT(result1 == 0);
    
    try {
      const result2 = await rejected(1).bimap(
        (error) => error + 1,
        (success) => success - 1
      ).run().promise();
    } catch (error) {
      $ASSERT(error == 2);
    }
