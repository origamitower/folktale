@annotate: Object.getOwnPropertyDescriptor(folktale.result.Error.prototype, 'value').get
category: Data fields
---

The value contained in an Error instance of the Result structure.

This is usually used to destructure the instance in a `.matchWith` call.

## Example::

    const Result = require('folktale/result');

    Result.Error(1).matchWith({
      Error: ({ value }) => value,    // equivalent to (x) => x.value
      Ok:    ({ value }) => 'nothing'
    });
    // ==> 1

