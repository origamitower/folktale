@annotate: folktale.concurrency.task._Task.prototype.mapRejected
category: Transforming tasks
---

Transforms the value of a failed task.


## Example::

    const { of, rejected } = require('folktale/concurrency/task');
    
    const hello = of('hello').mapRejected(v => v.toUpperCase());
    const result1 = await hello.run().promise();
    $ASSERT(result1 == 'hello');
    
    const hello2 = rejected('hello').mapRejected(v => v.toUpperCase());
    try {
      const result2 = await hello2.run().promise();
      throw 'never happens';
    } catch (error) {
      $ASSERT(error == 'HELLO');
    }
