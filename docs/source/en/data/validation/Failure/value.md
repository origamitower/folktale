@annotate: Object.getOwnPropertyDescriptor(folktale.data.validation.Failure.prototype, 'value').get
category: Data fields
---

The value contained in an Failure instance of the Validation structure.

This is usually used to destructure the instance in a `.matchWith` call.

## Example::

    const Validation = require('folktale/data/validation');

    Validation.Failure(1).matchWith({
      Failure: ({ value }) => value,    // equivalent to (x) => x.value
      Success: ({ value }) => 'nothing'
    });
    // ==> 1

