@annotate: folktale.data.task._Task.prototype.or
category: Combining tasks
---

Combines two tasks such that the resulting task assimilates the result of the
first one to resolve.

Note that once a task finishes, the other task is cancelled. If the combined
task is cancelled, both tasks are also cancelled.

As a convenience for combining a large or unknown amount of tasks, the
`waitAny()` function in the `data/task` module preceives an array of Tasks to
"or" together.


## Example::

    const { task } = require('folktale/data/task');

    const delay = (ms) => task(
      resolver => setTimeout(() => resolver.resolve(ms), ms),
      {
        cleanup: (timer) => clearTimeout(timer)
      }
    );

    const timeout = (ms) => task(
      resolver => setTimeout(() => resolver.reject(ms), ms),
      {
        cleanup: (timer) => clearTimeout(timer)
      }
    );

    const result = await delay(20).or(timeout(300))
                     .run().promise();
    $ASSERT(result == 20);

    const result2 = await delay(200).or(timeout(100))
                      .run().promise().catch(e => `timeout ${e}`);
    $ASSERT(result2 == 'timeout 100');
