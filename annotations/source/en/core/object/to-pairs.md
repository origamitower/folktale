@annotate: folktale.core.object.toPairs
category: Converting to other types
---
Returns pairs of `(key, value)` for all own enumerable properties in an object.


## Example::

    const toPairs = require('folktale/core/object/to-pairs');

    const pair = { x: 10, y: 20 };
    toPairs(pair);
    // ==> [['x', 10], ['y', 20]]
    // (in ES5- VMs this may be [['y', 20], ['x', 10]])


## Why?

Objects in JavaScript are commonly used as dictionaries, but natively
there are no operations to work with them in that way. This function
allows one to extract the `(key, value)` pairs from an object::

    const toPairs = require('folktale/core/object/to-pairs');

    const pair = { x: 10, y: 20 };
    toPairs(pair);
    // ==> [['x', 10], ['y', 20]]
    // or  [['y', 20], ['x', 10]]

Inherited properties, and those that are not marked as enumerable, are
not returned in the resulting array::

    const p1 = { z: 2 };
    const pair2 = Object.create(p1);
    pair2.x = 10; pair2.y = 20;

    toPairs(pair2);
    // ==> [['x', 10], ['y', 20]]
    // or  [['y', 20], ['x', 10]]

    // non-enumerable property x
    Object.defineProperty(p1, 'x', { value: 1 });

    toPairs(p1);
    // ==> [['z', 2]]


## Caveats

While ECMAScript 2015 specifies that objects are ordered using
insertion order, you're not guaranteed to get that behaviour in
any non-ES2015 engine, so for all effects it's better to treat
the result of this operation as an unordered collection.

