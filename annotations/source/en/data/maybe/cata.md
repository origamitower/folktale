@annotate: folktale.data.maybe.Just.prototype.cata
@annotate: folktale.data.maybe.Nothing.prototype.cata
category: Pattern matching
deprecated:
  version: '2.0.0'
  replacedBy: 'matchWith(pattern)'
  reason: |
    The `cata`(morphism) terminology is not very welcoming for people
    who are not familiar with some obscure jargon in functional programming.
    In addition to that, due to the design of Folktale's 2 ADT constructor,
    it's not possible to provide the same interface as Folktale 1's `.cata()`
    method, so changing the name while deprecating the old functionality
    allows people to move to Folktale 2 without breaking their code.
---

This method has been replaced by `matchWith(pattern)`. `cata`(morphism) selects
and executes a function for each variant of the Maybe structure.


## Example::

    const Maybe = require('folktale/data/maybe');

    Maybe.Just(1).cata({
      Nothing: ()   => 'nothing',
      Just: (value) => `got ${value}`
    });
    // ==> 'got 1'

    Maybe.Nothing().cata({
      Nothing: ()   => 'nothing',
      Just: (value) => `got ${value}`
    });
    // ==> 'nothing'
