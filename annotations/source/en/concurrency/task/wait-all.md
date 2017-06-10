@annotate: folktale.concurrency.task.waitAll
category: Combining tasks
---

Constructs a new task that waits all given tasks resolve. The result of the new
task is an array with the results of the input tasks, if they all succeed, or
the first failure if they fail.

While the tasks are started in the order they appear in the array, the function
will not wait one task to finish before starting another. For asynchronous
tasks this effectively gives you concurrent execution.

Note that cancelling one of the input tasks will cancel the combined task as
well. Cancelling the combined task will cancel all of the input tasks. If any of
the input tasks fails, all of the other input tasks will be cancelled as well.


## Example::

    const { of, waitAll } = require('folktale/concurrency/task');
    
    const result = await waitAll([
      of(1),
      of(2),
      of(3)
    ]).run().promise();
    
    $ASSERT(result == [1, 2, 3]);
