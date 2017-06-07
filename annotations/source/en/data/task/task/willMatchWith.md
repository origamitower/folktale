@annotate: folktale.data.task._Task.prototype.willMatchWith
category: Pattern matching
---

Chooses and executes a function for each variant in a Task. The function must
return a new task, whose value and state will be assimilated.


## Example::

    const { task, of, rejected } = require('folktale/data/task');
    
    const result1 = await of('hello').willMatchWith({
      Cancelled: () => of('cancelled'),
      Rejected: (error) => of(`rejected ${error}`),
      Resolved: (value) => of(`resolved ${value}`)
    }).run().promise();
    $ASSERT(result1 == 'resolved hello');
    
    const result2 = await rejected('hello').willMatchWith({
      Cancelled: () => of('cancelled'),
      Rejected: (error) => of(`rejected ${error}`),
      Resolved: (value) => of(`resolved ${value}`)
    }).run().promise();
    $ASSERT(result2 == 'rejected hello');
    
    const result3 = await task(r => r.cancel()).willMatchWith({
      Cancelled: () => of('cancelled'),
      Rejected: (error) => of(`rejected ${error}`),
      Resolved: (value) => of(`resolved ${value}`)
    }).run().promise();
    $ASSERT(result3 == 'cancelled');
