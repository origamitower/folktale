@annotate: folktale.data.task._Task.prototype.chain
category: Transforming tasks
---

Transforms the value and state of a Task.

As with `.map()` the transformation only happens if the original task resolves successfully, but instead of incorporating just the value, `.chain()` assimilates the value and state of the returned Task. This allows `.chain()` to be used for sequencing computations involving Task.


## Example::

    const { of, rejected } = require('folktale/data/task');
    
    const helloWorld = of('hello').chain(v => of(v + ' world'));
    const result1 = await helloWorld.run().promise();
    $ASSERT(result1 == 'hello world');
    
    const world = of('hello').chain(v => rejected('world'));
    try {
      const result2 = await world.run().promise();
    } catch (error) {
      $ASSERT(error == 'world');
    }
    
    const hello = rejected('hello').chain(v => of('world'));
    try {
      const result3 = await hello.run().promise();
    } catch (error) {
      $ASSERT(error == 'hello');
    }
