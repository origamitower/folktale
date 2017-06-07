@annotate: Object.getOwnPropertyDescriptor(folktale.data.validation.Success.prototype, 'value').get
category: Data fields
---

The value contained in an Success instance of the Validation structure.

This is usually used to destructure the instance in a `.matchWith` call.

## Example::

    const Validation = require('folktale/data/validation');

    Validation.Success(1).matchWith({
      Success: ({ value }) => value,    // equivalent to (x) => x.value
      Failure: ({ value }) => 'nothing'
    });
    // ==> 1