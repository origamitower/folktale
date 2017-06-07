@annotate: folktale.data.task._TaskExecution.prototype.listen
category: Reacting to Task state transitions
---

Adds a functions to be called when the task settles for each possible state it can transition to.


## Example::

    const { task } = require('folktale/data/task');
    
    task(r => r.resolve('hello')).run().listen({
      onCancelled: () => { throw 'never happens' },
      onRejected: (error) => { throw 'never happens' },
      onResolved: (value) => { $ASSERT(value == 'hello') }
    });
    
    task(r => r.reject('hello')).run().listen({
      onCancelled: () => { throw 'never happens' },
      onRejected: (error) => { $ASSERT(error == 'hello') },
      onResolved: (value) => { throw 'never happens' }
    });
    
    task(r => r.cancel()).run().listen({
      onCancelled: () => { $ASSERT(true) },
      onRejected: (error) => { throw 'never happens' },
      onResolved: (value) => { throw 'never happens' }
    });
