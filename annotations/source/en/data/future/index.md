@annotate: folktale.data.future
category: Concurrency
---

A data structure to represent the result of an asynchronous computation.

Results are not constructed directly (generally), but rather returned when asking for the eventual value of a task execution.


## Example::

    const { task } = require('folktale/data/task');

    const one = task(resolver => resolver.resolve(1));

    one.run().future().map(value => {
      $ASSERT(value == 1);
    });
