@annotate: folktale.data.conversions.maybeToValidation
category: Converting from Maybe
---
Converts a `Maybe` to a `Validation`. `Nothing`s map to `Failure`s, `Just`s map
to `Success`es.

Note that since `Maybe` failures can't hold a value in the `Nothing` tag, you 
must provide one for the validation.

## Example::

    const maybeToValidation = require('folktale/data/conversions/maybe-to-validation');
    const { Failure, Success } = require('folktale/data/validation');
    const { Nothing, Just } = require('folktale/data/maybe');

    maybeToValidation(Nothing(), 2);  // ==> Failure(2)
    maybeToValidation(Just(1), 2);    // ==> Success(1)
