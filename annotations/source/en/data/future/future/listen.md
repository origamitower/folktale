@annotate: folktale.data.future._Future.prototype.listen
category: Reacting to Futures
---

Adds a visitor to the Future, which will be invoked when the Future's state changes.

Listen allows reacting to changes in a Future, but is very imperative. In general, it's better to use `willMatchWith` or a more specialised method (like `.chain` or `.orElse`) instead.


## Example::

    const { of } = require('folktale/data/future');

    of('hello').listen({
      onCancelled: ()       => { throw 'never happens' },
      onRejected:  (reason) => { throw 'never happens' },
      onResolved:  (value)  => { $ASSERT(value == 'hello') }
    });
