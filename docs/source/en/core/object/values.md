@annotate: folktale.core.object.values
category: Extracting data
---
Returns the values for all own enumerable properties in an object.


## Example::

    const values = require('folktale/core/object/values');

    const pair = { x: 10, y: 20 };
    values(pair);
    // ==> [10, 20] 
    // (In ES5- VMs this may be [20, 10])


## Why?

Objects in JavaScript are commonly used as dictionaries, but natively
there are no operations to work with them in that way. This function
allows one to extract the values from an object::

    const values = require('folktale/core/object/values');

    const pair = { x: 10, y: 20 };
    values(pair);
    // ==> [10, 20]  
    // or  [20, 10]

Inherited properties, and those that are not marked as enumerable, are
not returned in the resulting array::

    const p1 = { z: 2 };
    const pair2 = Object.create(p1);
    pair2.x = 10; pair2.y = 20;

    values(pair2);
    // ==> [10, 20] 
    // or  [20, 10]

    // non-enumerable property x
    Object.defineProperty(p1, 'x', { value: 1 });

    values(p1);
    // ==> [2]


## Caveats

While ECMAScript 2015 specifies that objects are ordered using
insertion order, you're not guaranteed to get that behaviour in
any non-ES2015 engine, so for all effects it's better to treat
the result of this operation as an unordered collection.

