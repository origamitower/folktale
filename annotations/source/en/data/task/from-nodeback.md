@annotate: folktale.data.task.fromNodeback
category: Converting from function with Node-style callback
---

A convenience method for the `folktale/data/conversions/nodeback-to-task` module.

## Example::

    const Task = require('folktale/data/task');

    const fn = (str, str2, cb) => cb(null, str + str2 + 'processed');
    const convertedFn = Task.fromNodeback(fn);
    const task = convertedFn('test', '-was-');
    const value = await task.run().promise();

    $ASSERT(value === 'test-was-processed');
