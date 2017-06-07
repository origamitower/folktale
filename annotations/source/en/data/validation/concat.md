@annotate: folktale.data.validation.Failure.prototype.concat
@annotate: folktale.data.validation.Success.prototype.concat
category: Combining validations
---

Combines two validations together such that failures are aggregated.

In cases where both validations contain a successful value, this method just selects the last validation.


## Example::

    const { Success, Failure } = require('folktale/data/validation');

    Failure('a').concat(Failure('b'));
    // ==> Failure('ab')

    Failure('a').concat(Success('b'));
    // ==> Failure('a')

    Success('a').concat(Failure('b'));
    // ==> Failure('b')

    Success('a').concat(Success('b'));
    // ==> Success('b')