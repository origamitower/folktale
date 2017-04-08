@annotate: folktale.data.task.rejected
category: Constructing
---

Constructs a Task that resolves with a rejected value.

The value is computed eagerly. If you need the value to be computed only when the task is ran you'll have to use the `task` function.


## Example::

    const { rejected } = require('folktale/data/task');
    
    try {
      const result = await rejected('hello').run().promise();
    } catch (error) {
      $ASSERT(error == 'hello');
    }
    
