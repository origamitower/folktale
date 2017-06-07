@annotate: folktale.data.result.try
category: Handling errors
---

Runs a function that may raise an exception, trapping it. Returns an `Ok` with
the return value of the function, if it has finished successfully, or an `Error`
with the raised exception.

## Example::

    function successor(natural) {
      if (natural < 0) {
        throw `Not a natural number: ${natural}`;
      } else {
        return natural + 1;
      }
    }
    
    const Result = require('folktale/data/result');
    
    Result.try(() => successor(-1));
    // ==> Result.Error('Not a natural number: -1')
    
    Result.try(() => successor(1));
    // ==> Result.Ok(2)
