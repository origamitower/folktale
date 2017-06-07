@annotate: folktale.data.validation.Failure.prototype.get
@annotate: folktale.data.validation.Success.prototype.get
category: Extracting values
deprecated:
  version: '2.0.0'
  replacedBy: unsafeGet()
  reason: |
    We want to discourage the use of partial functions, and having short names
    makes it easy for people to want to use them without thinking about the
    problems.
    
    For more details see https://github.com/origamitower/folktale/issues/42
---

This method has been renamed to `unsafeGet()`.
