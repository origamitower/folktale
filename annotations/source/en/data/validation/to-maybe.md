@annotate: folktale.data.validation.Failure.prototype.toMaybe
@annotate: folktale.data.validation.Success.prototype.toMaybe
category: Converting to other types
---

Transforms a Validation into a Maybe. Failure values are lost in the process.

## Example::

    const { Success, Failure } = require('folktale/data/validation');
    const Maybe = require('folktale/data/maybe');

    Success('a').toMaybe();
    // ==> Maybe.Just('a')

    Failure('a').toMaybe();
    // ==> Maybe.Nothing()