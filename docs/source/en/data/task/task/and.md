@annotate: folktale.data.task._Task.prototype.and
category: Combining tasks
---

Constructs a new task that awaits both tasks to resolve. The result of the new task is a tuple containing the results of the left and right tasks, if they all succeed, or the first failure if they fail.

While the tasks are started from left-to-right, the method will not wait one task to finish before starting another. For asynchronous tasks this effectively gives you concurrent execution.

Note that cancelling one of the input tasks will cancel the combined tasks as well. Cancelling the combined tasks will cancell both input tasks. If any of the input tasks fail, the other input task will be cancelled as well.

If you need to combine more than two tasks concurrently, take a look at the `waitAll` function in the `data/task` module.


## Example::

    const { task } = require('folktale/data/task');
    
    const delay = (ms) => task(
      resolver => setTimeout(() => resolver.resolve(ms), ms),
      {
        cleanup: (timer) => clearTimeout(timer)
      }
    );
    
    const result = await delay(30).and(delay(40)).run().promise();
    $ASSERT(result == [30, 40]);
