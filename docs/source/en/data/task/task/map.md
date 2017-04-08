@annotate: folktale.data.task._Task.prototype.map
category: Transforming tasks
---

Transforms the value of a successful task.


## Example::

    const { of, rejected } = require('folktale/data/task');
    
    const hello = of('hello').map(v => v.toUpperCase());
    const result1 = await hello.run().promise();
    $ASSERT(result1 == 'HELLO');
    
    const hello2 = rejected('hello').map(v => v.toUpperCase());
    try {
      const result2 = await hello2.run().promise();
      throw 'never happens';
    } catch (error) {
      $ASSERT(error == 'hello');
    }
