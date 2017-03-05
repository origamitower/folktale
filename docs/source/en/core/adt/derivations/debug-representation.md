@annotate: folktale.core.adt.derivations.debugRepresentation
---
Provides a textual representation for ADTs.

The `debugRepresentation` serialisation bestows ES2015's `Symbol.toStringTag`, used
for the native `Object.prototype.toString`, along with a `.toString()`
method and Node's REPL `.inspect()` method.


## Example::

    const { data, derivations } = require('folktale/core/adt');
    const { Id } = data('Id', {
      Id(value){ return { value } }
    }).derive(derivations.debugRepresentation);

    Object.prototype.toString.call(Id(1));
    // => '[object Id.Id]'

    Id(1).toString();
    // ==> 'Id.Id({ value: 1 })'

    Id(1).inspect();
    // ==> 'Id.Id({ value: 1 })'


## ES2015's ToStringTag

This derivation defines ES2015's `ToStringTag` symbol, which is used
by [Object.prototype.toString][toString] to construct a default textual
representation of the object.

This means that instead of getting `'[object Object]'`, you'll get
a more helpful `'[object <Type>.<Tag>]'` representation, where this
function is used.

[toString]: http://www.ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring


## Textual representation

This derivation defines a `.toString()` method. `.toString` is called
in many places to define how to represent an object, but also called
when JS operators want to convert an object to a String. This derivation
only cares about representation that's suitable for debugging.

The representation includes the type, tag, and key/value pairs of the
data structure.


## Node REPL representation

Node's REPL uses `.inspect()` instead of the regular `.toString()`.
This derivation also provides the `.inspect()` method, but just as
an alias for the `.toString()` method.


