@annotate: folktale.data.maybe.Nothing.prototype.orElse
@annotate: folktale.data.maybe.Just.prototype.orElse
category: Recovering from errors
---

Allows recovering from from failed Maybe values.

While `.chain()` allows one to sequence operations, such that the second
operation is ran only if the first one succeeds, and their state is propagated,
`.orElse()` allows one to recover from a failed operation by providing a new
state.

## Example::

    const Maybe = require('folktale/data/maybe');

    function first(list) {
      return list.length > 0 ?   Maybe.Just(list[0])
      :      /* otherwise */     Maybe.Nothing();
    }

    let failures = 0;
    function emitFailure() {
      failures += 1;
      return Maybe.Just('failed');
    }

    first(['one']).orElse(emitFailure);
    // ==> Maybe.Just('one')

    failures; // ==> 0

    first([]).orElse(emitFailure);
    // ==> Maybe.Just('failed')

    failures; // ==> 1

