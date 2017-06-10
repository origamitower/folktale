@annotate: folktale.concurrency.task._TaskExecution.prototype.future
category: Extracting eventual values
---

Gets the eventual value of a Task as a Folktale `Future`.


## Example::

    const { task, of, rejected } = require('folktale/concurrency/task');
    const { Cancelled, Resolved, Rejected } = require('folktale/concurrency/future/_execution-state');
    
    of(1).run().future()._state;
    // ==> Resolved(1)
    
    rejected(1).run().future()._state;
    // ==> Rejected(1)
    
    task(r => r.cancel()).run().future()._state;
    // ==> Cancelled()
