@annotate: folktale.concurrency.task.rejected
category: Constructing
---

Constructs a Task that resolves with a rejected value.

The value is computed eagerly. If you need the value to be computed only when the task is ran you'll have to use the `task` function.


## Example::

    const { rejected } = require('folktale/concurrency/task');
    
    try {
      const result = await rejected('hello').run().promise();
      throw 'never happens';
    } catch (error) {
      $ASSERT(error == 'hello');
    }
    
