@annotate: folktale.maybe.Nothing.prototype.filter
@annotate: folktale.maybe.Just.prototype.filter
category: Transforming
---

If the Maybe is a Just, passes its value to the predicate. If the predicate
returns true, then the Maybe is returned unchanged. In every other case,
a Nothing gets returned.

## Example::

    const User  = require('user');

    let user = new User(1);

    user
    .getPasswordResetHash();          // Assuming this returns a Result…
    .filter(User.hashStillActive)
    .map(console.log.bind(console));  // Will print the hash only if it's still active.
