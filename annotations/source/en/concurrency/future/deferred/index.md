@annotate: folktale.concurrency.future._Deferred
category: Types
---

A deferred is an internal structure for creating Futures. Because deferred is an imperative structure, users should instead construct futures through the Task structure.


@annotate: folktale.concurrency.future._Deferred.prototype
category: Special Values
---

A container for methods of Deferreds.


@annotate: Object.getOwnPropertyDescriptor(folktale.concurrency.future._Deferred.prototype, '_state').get
category: Data Fields
---

The current state of the deferred, as an ExecutionState.


@annotate: Object.getOwnPropertyDescriptor(folktale.concurrency.future._Deferred.prototype, '_listeners').get
category: Data Fields
---

An array of visitors providing functions to be ran when the deferred's state changes.


@annotate: folktale.concurrency.future._Deferred.prototype.resolve
category: Resolving
---

Resolves a deferred successfully with a value.


@annotate: folktale.concurrency.future._Deferred.prototype.reject
category: Resolving
---

Resolves a deferred with a failure value.


@annotate: folktale.concurrency.future._Deferred.prototype.cancel
category: Resolving
---

Resolves a deferred with a cancellation value.


@annotate: folktale.concurrency.future._Deferred.prototype.maybeCancel
category: Resolving
---

Resolves a deferred with a cancellation value, but doesn't throw if the deferred has already been resolved.


@annotate: folktale.concurrency.future._Deferred.prototype.listen
category: Reacting to Deferreds
---

Adds a visitor to be invoked when the deferred's state changes.


@annotate: folktale.concurrency.future._Deferred.prototype.promise
category: Extracting Values
---

Retrieves the value of a deferred as a Promise. Cancellations are mapped to a rejected promise with a special object.


@annotate: folktale.concurrency.future._Deferred.prototype.future
category: Extracting Values
---

Retrieves the value of a deferred as a Future.


@annotate: folktale.concurrency.future._Deferred.prototype.toString
@annotate: folktale.concurrency.future._Deferred.prototype.inspect
category: Debugging
---

Returns a textual description of the object.
