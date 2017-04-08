@annotate: folktale.data.task._Task.prototype.mapRejected
category: Transforming tasks
---

Transforms the value of a failed task.


## Example::

    const { of, rejected } = require('foltkale/data/task');
    
    const hello = of('hello').mapRejected(v => v.toUpperCase());
    const result1 = await hello.run().promise();
    $ASSERT(result1 == 'hello');
    
    const hello2 = rejected('hello').mapRejected(v => v.toUpperCase());
    try {
      const result2 = await hello2.run().promise();
    } catch (error) {
      $ASSERT(error == 'HELLO');
    }
