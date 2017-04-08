@annotate: folktale.data.task._Task.prototype.run
category: Executing tasks
---

Executes a Task and returns a `TaskExecution` object representing the execution.


## Example::

    const { task } = require('folktale/data/task');
    
    let message = '';
    const sayHello = task(resolver => {
      message = 'hello';
      resolver.resolve();
    });
    
    $ASSERT(message == '');
    
    await sayHello.run().promise();
    
    $ASSERT(message == 'hello');
