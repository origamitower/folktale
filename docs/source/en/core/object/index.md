@annotate: folktale.core.object
category: Extensions for built-ins
---
Core.Object provides utilities for working with objects as
dictionaries and records.


## Why?

JS historically lacked data structures designed specifically for
representing records and dictionaries, and objects just doubled
as those for the common use cases. While JS has added Map and
Set structures natively, using objects as records and dictionaries
is still common place, and there aren't many tools to use them
for those use cases natively.

For example, these objects are used as options for configuring
operations, like babylon's `parse` operation, or Node's `readFile`.
They're used to represent headers in most HTTP libraries, or to
represent environment variables in Node, etc.

Folktale's Core.Object primarily aims to provide common tools for
using objects as dictionaries. In doing so, most of the operations
in this module are only concerned about own, enumerable properties,
and don't respect the original object's shape. That is, a
transformation such as:

    toPairs(fromPairs(object))

Doesn't return a value necessarily equivalent to `object`. Because
all transformations are pure, objects get a new identity, they also
lose all symbols and non-enumerable properties, as well as the
`[[Prototype]]` field.


## What's in Core.Object?

Currently Core.Object provides operations for converting from and to
objects, and transforming objects. These operations are categorised
as follows:

  - **Converting**: Operations that convert the data in the object
    to other types.

  - **Transforming**: Operations that transform the data in the
    object, giving you a new object.

