@annotate: folktale.concurrency.future._ExecutionState
category: Types
---

An union defining the possible states of a Future.


@annotate: folktale.concurrency.future._ExecutionState.Pending
category: Variant
---

The state of a future that's still not resolved.


@annotate: folktale.concurrency.future._ExecutionState.Cancelled
category: Variant
---

The state of a future that has been cancelled.


@annotate: folktale.concurrency.future._ExecutionState.Resolved
category: Variant
---

The state of a future that has been successfully resolved with a value.


@annotate: folktale.concurrency.future._ExecutionState.Rejected
category: Variant
---

The state of a future that has been resolved with a failure.


@annotate: folktale.concurrency.future._ExecutionState.toString
@annotate: folktale.concurrency.future._ExecutionState.inspect
category: Debugging
---

A textual representation of the state.


@annotate: folktale.concurrency.future._ExecutionState.variants
category: Special Values
---

The variants in the ExecutionState


@annotate: folktale.concurrency.future._ExecutionState.hasInstance
category: Testing and Comparing
---

True if the value is any execution state instance.


@annotate: folktale.concurrency.future._ExecutionState.Cancelled.hasInstance
@annotate: folktale.concurrency.future._ExecutionState.Pending.hasInstance
@annotate: folktale.concurrency.future._ExecutionState.Rejected.hasInstance
@annotate: folktale.concurrency.future._ExecutionState.Resolved.hasInstance
category: Testing and Comparing
---

True if the value is an instance of the state.


@annotate: folktale.concurrency.future._ExecutionState.Cancelled.toString
@annotate: folktale.concurrency.future._ExecutionState.Cancelled.inspect
@annotate: folktale.concurrency.future._ExecutionState.Pending.toString
@annotate: folktale.concurrency.future._ExecutionState.Pending.inspect
@annotate: folktale.concurrency.future._ExecutionState.Rejected.toString
@annotate: folktale.concurrency.future._ExecutionState.Rejected.inspect
@annotate: folktale.concurrency.future._ExecutionState.Resolved.toString
@annotate: folktale.concurrency.future._ExecutionState.Resolved.inspect
category: Debugging
---

A textual representation of the state


@annotate: Object.getOwnPropertyDescriptor(folktale.concurrency.future._ExecutionState.Cancelled, 'type').get
@annotate: Object.getOwnPropertyDescriptor(folktale.concurrency.future._ExecutionState.Pending, 'type').get
@annotate: Object.getOwnPropertyDescriptor(folktale.concurrency.future._ExecutionState.Resolved, 'type').get
@annotate: Object.getOwnPropertyDescriptor(folktale.concurrency.future._ExecutionState.Rejected, 'type').get
category: Special Values
---

The internal type of the variant.


@annotate: Object.getOwnPropertyDescriptor(folktale.concurrency.future._ExecutionState.Cancelled, 'tag').get
@annotate: Object.getOwnPropertyDescriptor(folktale.concurrency.future._ExecutionState.Pending, 'tag').get
@annotate: Object.getOwnPropertyDescriptor(folktale.concurrency.future._ExecutionState.Resolved, 'tag').get
@annotate: Object.getOwnPropertyDescriptor(folktale.concurrency.future._ExecutionState.Rejected, 'tag').get
category: Special Values
---

The internal tag of the variant.


@annotate: Object.getOwnPropertyDescriptor(folktale.concurrency.future._ExecutionState.Cancelled, 'constructor').get
@annotate: Object.getOwnPropertyDescriptor(folktale.concurrency.future._ExecutionState.Pending, 'constructor').get
@annotate: Object.getOwnPropertyDescriptor(folktale.concurrency.future._ExecutionState.Resolved, 'constructor').get
@annotate: Object.getOwnPropertyDescriptor(folktale.concurrency.future._ExecutionState.Rejected, 'constructor').get
@annotate: Object.getOwnPropertyDescriptor(folktale.concurrency.future._ExecutionState.Cancelled.prototype, 'constructor').get
@annotate: Object.getOwnPropertyDescriptor(folktale.concurrency.future._ExecutionState.Pending.prototype, 'constructor').get
@annotate: Object.getOwnPropertyDescriptor(folktale.concurrency.future._ExecutionState.Resolved.prototype, 'constructor').get
@annotate: Object.getOwnPropertyDescriptor(folktale.concurrency.future._ExecutionState.Rejected.prototype, 'constructor').get
category: Special Values
---

The constructor for the variant


@annotate: folktale.concurrency.future._ExecutionState.Rejected.prototype
@annotate: folktale.concurrency.future._ExecutionState.Pending.prototype
@annotate: folktale.concurrency.future._ExecutionState.Resolved.prototype
@annotate: folktale.concurrency.future._ExecutionState.Cancelled.prototype
category: Debugging
---

A container of methods for the variant.
