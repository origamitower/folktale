@annotate: folktale.data.task._TaskExecution.prototype.cancel
category: Cancelling tasks
---

Cancels a task execution. Does nothing if the task has already been resolved.


## Example::

    const { task } = require('folktale/data/task');
    
    let message = 'world';
    const helloIn50 = task(
      resolver => setTimeout(() => {
        message = 'hello';
        resolver.resolve();
      }, 50),
      {
        cleanup: (timer) => clearTimeout(timer)
      }
    );
    
    const execution = helloIn50.run();
    execution.cancel();
    try {
      const result = await execution.promise();
      throw 'never happens';
    } catch (error) {
      $ASSERT(message == 'world');
    }
