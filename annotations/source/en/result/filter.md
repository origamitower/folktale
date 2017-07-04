@annotate: folktale.result.Error.prototype.filter
@annotate: folktale.result.Ok.prototype.filter
category: Transforming
---

If the Result is a Ok, passes its value to the predicate. If the predicate
returns true, then the Result is returned unchanged. In every other case,
an Error gets returned.

## Example::

    const User  = require('user');

    let user = new User(1);

    user
    .getPasswordResetHash();         // Assuming this returns a Result…
    .filter(User.hashStillActive)
    .map(console.log.bind(console)); // Will print the hash only if it's still active.
