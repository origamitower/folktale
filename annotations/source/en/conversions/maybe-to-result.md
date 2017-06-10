@annotate: folktale.conversions.maybeToResult
category: Converting from Maybe
---
Converts a `Maybe` to an `Result`. `Nothing`s map to `Error`s, `Just`s map to
`Ok`s.

Note that since `Maybe`s don't hold a value for failures in the `Nothing` tag, 
you must provide one to this function.


## Example::

    const maybeToResult = require('folktale/conversions/maybe-to-result');
    const { Error, Ok } = require('folktale/result');
    const { Nothing, Just } = require('folktale/maybe');

    maybeToResult(Nothing(), 2); // ==> Error(2)
    maybeToResult(Just(1), 2);   // ==> Ok(1)
