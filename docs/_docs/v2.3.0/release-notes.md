---
title: Release notes
prev_doc: v2.3.0
next_doc: v2.3.0/download
---

Folktale v2.3.0 is another small iteration.

You can look at the [full changelog]({% link _docs/v2.3.0/changelog.md %}) for details.


## Improving the documentation

Besides the occasional typos, there were incorrect code examples in the documentation. For most code examples we do actually run them as part of the test cases to ensure that they work and didn't get out of sync with the code, but there are places where this isn't possible yet. Thanks to everyone who spotted these mistakes and sent PRs to fix them :>


## More useful errors in ADTs

Again, the ADT module is still pretty experimental, and there are a fair bit of problems that need to be fixed in it. This release brings better error messages for the `.matchWith` method. In previous versions, forgetting to provide a case for a `.matchWith` call could be very frustrating.

```js
const { union } = require('folktale@2.1.0/adt/union');
const Optional = union('optional', {
  Some(value) { return { value } },
  None() { return {} }
});

function getValue(optional) {
  return optional.matchWith({
    Some(value) { return value }
  });
}

getValue(Optional.Some(1));  // => 1
getValue(Optional.None());   // => TypeError: pattern[name] is not a function
```

In Folktale 2.3 you get a more descriptive error message:

    Error: Variant "None" is not covered in pattern.
    This could mean you did not include all variants in 
    your Union's matchWith function.

    For example, if you had this Union:

    const Operation = union({
      Add: (a, b) => ({ a, b }),
      Subtract: (a, b) => ({ a, b }),
    })

    But wrote this matchWith:

    op.matchWith({
      Add: ({ a, b }) => a + b
      // Subtract not implemented!
    })

    It would throw this error because we need to check against 'Subtract'. 
    Check your matchWith function's argument, it's possibly missing the 
    'None' method in the object you've passed.

We've also added a special `any` value that matches any variant in a `.matchWith`. This can be helpful in variants that have a large amount of cases that you're not really interested in handling separately for a particular function.

```js
const { union } = require('folktale/adt/union');

const Optional = union('optional', {
  Some(value) { return { value } },
  None() { return {} }
});

function getValue(optional) {
  return optional.matchWith({
    Some(value) { return value },
    [union.any]() { return null }
  });
}

getValue(Optional.Some(1));  // => 1
getValue(Optional.None());   // => null
```


## Acknowledgements

As always, a huge thank you to everyone who contributed to improving Folktale, by reporting errors, sending feedback, talking about it, sending patches, etc.

This release wouldn't be possible without the contributions of @Josh-Miller, @JesterXL, @andys8, and @pernas. Really, thank you :>


