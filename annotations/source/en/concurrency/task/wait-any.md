@annotate: folktale.concurrency.task.waitAny
category: Combining tasks
---

Constructs a new task that waits any of the given tasks resolve. The result of
the first task to resolve is assimilated by the new task.

While the tasks are started in the order they appear in the array, the function
will not wait one task to finish before starting another. For asynchronous
tasks this effectively gives you concurrent execution.


Note that cancelling the combined task will cancel all of the input tasks, and
any of the input tasks resolving will also cancel all of the other input tasks.


## Example::

    const { task, waitAny } = require('folktale/concurrency/task');
    
    const delay = (ms) => task(
      resolver => {
        const timerId = setTimeout(() => resolver.resolve(ms), ms);
        resolver.cleanup(() => {
          clearTimeout(timerId);
        })
      }
    );
    
    const result = await waitAny([
      delay(60),  // cancelled after 30ms
      delay(30)
    ]).run().promise();
    
    $ASSERT(result == 30);
