@annotate: folktale.data.task._Task.prototype.swap
category: Recovering from errors
---

Inverts the state of a Task. That is, turns successful tasks into failed ones, and failed tasks into successful ones.


## Example::

    const { of, rejected } = require('folktale/data/task');
    
    try {
      const result1 = await of(1).swap().run().promise();
      throw 'never happens';
    } catch (error) {
      $ASSERT(error == 1);
    }
    
    const result2 = await rejected(1).swap().run().promise();
    $ASSERT(result2 == 1);
