@annotate: folktale.concurrency.task.fromNodeback
category: Converting from function with Node-style callback
---

A convenience method for the `folktale/conversions/nodeback-to-task` module.

## Example::

    const Task = require('folktale/concurrency/task');

    const fn = (str, str2, cb) => cb(null, str + str2 + 'processed');
    const convertedFn = Task.fromNodeback(fn);
    const task = convertedFn('test', '-was-');
    const value = await task.run().promise();

    $ASSERT(value === 'test-was-processed');
