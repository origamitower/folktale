@annotate: folktale.data.conversions.resultToMaybe
category: Converting from Result
---
Converts an `Result` structure to a Maybe structure. `Error`s map to `Nothing`s,
`Ok`s map to `Just`s.

Not that `Error` values are lost in the conversion process, since failures
in `Maybe` (the `Nothing` tag) don't have a value.

## Example::

    const resultToMaybe = require('folktale/data/conversions/result-to-maybe');
    const { Error, Ok } = require('folktale/data/result');
    const { Just, Nothing } = require('folktale/data/maybe');
    
    resultToMaybe(Error(1));  // ==> Nothing()
    resultToMaybe(Ok(1)); // ==> Just(1) 
