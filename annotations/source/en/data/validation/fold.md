@annotate: folktale.data.validation.Failure.prototype.fold
@annotate: folktale.data.validation.Success.prototype.fold
category: Pattern matching
---

Applies a function to each case of a Validation.


## Example::

    const { Success, Failure } = require('folktale/data/validation');

    const upcase = (x) => x.toUpperCase();
    const double = (x) => x + x;

    Success('a').fold(upcase, double);
    // ==> 'aa'

    Failure('a').fold(upcase, double);
    // ==> 'A'