@annotate: folktale.concurrency.task.do
category: Sequencing tasks
---

Allows using a direct style of programming (similar to `async/await` for Promises) to sequence Tasks. The function **must** return a Task.


## Example::

    const task = require('folktale/concurrency/task');

    const resultTask = task.do(function* () {
      const a = yield task.of(1);
      const b = yield task.of(2);

      return task.of((a + b) * (yield task.of(3)));
    });

    const value = await resultTask.run().promise();
    $ASSERT(value == 9);