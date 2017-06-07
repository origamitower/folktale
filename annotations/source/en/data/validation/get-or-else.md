@annotate: folktale.data.validation.Failure.prototype.getOrElse
@annotate: folktale.data.validation.Success.prototype.getOrElse
category: Extracting values
---

Extracts the value of a Validation structure, if it's a Success, otherwise returns the provided default value.


## Example::

    const { Success, Failure } = require('folktale/data/validation');

    Success('a').getOrElse('b');
    // ==> 'a'

    Failure('a').getOrElse('b');
    // ==> 'b'