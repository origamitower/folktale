@annotate: folktale.data.task.of
category: Constructing
---

Constructs a Task that resolves with a successful value.

The value is computed eagerly. If you need the value to be computed only when the task is ran you'll have to use the `task` function.


## Example::

    const { of } = require('folktale/data/task');
    
    const result = await of('hello').run().promise();
    $ASSERT(result == 'hello');
