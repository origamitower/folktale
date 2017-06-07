@guide: Improving Folktale's tests
category: 3. Contributing
authors:
  - "@robotlolita"
---

Folktale uses a mix of property-based and unit tests. Read this to understand how to add new tests, or update existing ones.

* * *

Folktale uses [Mocha](https://mochajs.org/) and
[JSVerify](https://github.com/jsverify/jsverify) for tests. Property-based tests
are preferable, but sometimes example-based tests make more sense, Amanda
Laucher and Paul Snively have a very good
[talk about when to use Property-based tests and when to use example-based tests](https://www.infoq.com/presentations/Types-Tests),
which you can use as a basis to make this decision.

Tests go in the proper `<category>.<subcategory>.js` file in the `test/specs-src/` folder
for the category of the functionality you're writing tests for. For example,
tests for the `compose` function of `core/lambda` would go in the
`test/specs-src/core.lambda.js` file. If the file already exists, you only need to add a new
test definition to it. Otherwise, you'll need to create a new file.

Here's an example of how one would write tests for the `compose` function, in a
`core.lambda.js` file:

```js
// Import the jsverify library. This will be used to define the tests
const { property } = require('jsverify');

// Import the category we're testing (core.lambda). By convention, the
// variable `_` is used to hold this object, since it has less visual
// clutter.
const _ = require('folktale').core.lambda;

// Define the test case. Mocha adds the `describe` function to define
// a test suite. You should create a suite for the category, and a
// suite for the function being tested inside of that:
describe('Core.Lambda', () => {
  describe('compose', () => {
    // Finally, we define our test, using JSVerify's `property`
    property('Associativity', 'nat', (a) => {
      const f = (x) => x - 1;
      const g = (x) => x * 2;
      const h = (x) => x / 3;

      return _.compose(f, _.compose(g, h))(a)
      ===    _.compose(_.compose(f, g), h)(a)
    })
  })
})
```

With property based tests, JSVerify generates random data of the type described
in the property and feeds it into the function. When an error occurs, it tries
to find the smallest value that still reproduces the error and reports that to
you, so you can try to debug it.

Sometimes it makes more sense to write an example-based test than a
property-based one. For these, instead of the `property` function from JSVerify,
test cases are defined with the `it` function from Mocha, and assertions use
Node's native `assert` module:

```js
const assert = require('assert');
const _ = require('folktale').core.lambda;

describe('Core.Lambda', _ => {
  describe('compose', _ => {
    it('Invokes functions from right to left', _ => {
      const f = (x) => x - 1;
      const g = (x) => x * 2;

      assert.equal(_.compose(f, g)(2), 3);
    })
  })
})
```

To run tests, you can use `make test` from the root of the project.
