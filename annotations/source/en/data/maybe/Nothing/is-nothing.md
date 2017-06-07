@annotate: Object.getOwnPropertyDescriptor(folktale.data.maybe.Nothing.prototype, 'isNothing').get
category: Comparing and testing
deprecated:
  version: '2.0.0'
  replacedBy: 'hasInstance(value)'
  reason: |
    The `.isNothing` field is deprecated in favour of the new `Nothing.hasInstance(value)` method.
    The `.hasInstance()` version allow safely testing any value, even non-objects, and also
    do union instance checking, rather than a simple tag check;
---

True if the value is a `Nothing` instance.