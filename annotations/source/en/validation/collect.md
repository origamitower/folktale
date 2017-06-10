@annotate: folktale.validation.collect
category: Combining validations
---

Combines all validation values from an array of them.

The function is a convenient way of concatening validations one by one, and will concatenate failures together, but will only maintain the last successful value if they are all successful.


## Example::

    const { Success, Failure, collect } = require('folktale/validation');

    collect([
      Success('a'),
      Success('b'),
      Success('c')
    ]);
    // ==> Success('c')

    collect([
      Failure('a'),
      Success('b'),
      Failure('c')
    ]);
    // ==> Failure('ac')

    collect([
      Failure('a'),
      Failure('b'),
      Failure('c')
    ]);
    // ==> Failure('abc')