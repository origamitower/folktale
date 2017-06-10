@annotate: folktale.concurrency.task._Task.prototype.orElse
category: Recovering from errors
---

Transforms a failed task's value and state.


## Example::

    const { of, rejected } = require('folktale/concurrency/task');
    
    const hello = of('hello').orElse(error => of('world'));
    const result1 = await hello.run().promise();
    $ASSERT(result1 == 'hello');
    
    const world = rejected('hello').orElse(error => of('world'));
    const result2 = await world.run().promise();
    $ASSERT(result2 == 'world');
    
    const helloWorld = rejected('hello').orElse(error => rejected(error + ' world'));
    try {
      const result3 = await helloWorld.run().promise();
      throw 'never happens';
    } catch (error) {
      $ASSERT(error == 'hello world');
    }
