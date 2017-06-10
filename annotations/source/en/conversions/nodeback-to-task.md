@annotate: folktale.conversions.nodebackToTask
category: Converting from function with Node-style callback
---
Converts a function with a Node-style callback to a `Task`.


## Example::

    const nodebackFromTask = require('folktale/conversions/nodeback-to-task');

    const fn = (str, str2, cb) => cb(null, str + str2 + 'processed');
    const convertedFn = nodebackFromTask(fn);
    const task = convertedFn('test', '-was-');
    const value = await task.run().promise();

    $ASSERT(value === 'test-was-processed');
