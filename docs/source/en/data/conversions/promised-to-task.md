@annotate: folktale.data.conversions.promisedToTask
category: Converting from Promises
---

Converts a Promise-yielding function to a Task-yielding function.


## Example::

    const promisedToTask = require('folktale/data/conversions/promised-to-task');

    function delay(ms) {
      return new Promise((resolve) => {
        setTimeout(() => resolve(ms), ms)
      });
    }

    const delayT = promisedToTask(delay);

    await delayT(10).run().promise();
    // resolves after 10ms
