@annotate: folktale.concurrency.task.fromPromised
category: Converting from other types
---

Converts a Promise-yielding function to a Task-yielding function.


## Example::

    const { fromPromised } = require('folktale/concurrency/task');

    function delay(ms) {
      return new Promise((resolve) => {
        setTimeout(() => resolve(ms), ms)
      });
    }

    const delayT = fromPromised(delay);

    await delayT(10).run().promise();
    // resolves after 10ms
