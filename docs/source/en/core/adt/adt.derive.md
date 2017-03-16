@annotate: folktale.core.adt.data.ADT.derive
category: Meta-programming
---
Allows a function to provide functionality to variants in an ADT.

The `derive` method exists to support meta-programming on ADT objects,
such that additional functionality (implementation of interfaces or
protocols, for example) may be provided by libraries instead of having
to be hand-coded by the user.

The operation accepts many `derivation` functions, which will be invoked
for each variant in the ADT, where a Variant is just an object with the
following attributes:

    interface Variant(Any...) -> 'a <: self.prototype {
      tag         : String,
      type        : Any,
      constructor : Constructor,
      prototype   : Object
    }

