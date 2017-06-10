@annotate: Object.getOwnPropertyDescriptor(folktale.result.Ok.prototype, 'value').get
category: Data fields
---

The value contained in an Ok instance of the Result structure.

This is usually used to destructure the instance in a `.matchWith` call.

## Example::

    const Result = require('folktale/result');

    Result.Ok(1).matchWith({
      Error: ({ value }) => 'nothing',
      Ok:    ({ value }) => value    // equivalent to (x) => x.value
    });
    // ==> 1

