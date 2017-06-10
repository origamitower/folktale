@annotate: folktale.validation.Failure.prototype.toMaybe
@annotate: folktale.validation.Success.prototype.toMaybe
category: Converting to other types
---

Transforms a Validation into a Maybe. Failure values are lost in the process.

## Example::

    const { Success, Failure } = require('folktale/validation');
    const Maybe = require('folktale/maybe');

    Success('a').toMaybe();
    // ==> Maybe.Just('a')

    Failure('a').toMaybe();
    // ==> Maybe.Nothing()