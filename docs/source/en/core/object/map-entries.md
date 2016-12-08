@annotate: folktale.core.object.mapEntries
---
Transforms own properties of an object using a mapping function.

The transformation takes a `[key, value]` pair, and is expected to return
a new `[key, value]` pair. The resulting object has not only its values
transformed, but also its keys.


## Example::

    const mapEntries = require('folktale/core/object/map-entries');

    const pair = { x: 10, y: 20 };
    mapEntries(
      pair,
      ([key, value]) => [key.toUpperCase(), value * 2],
      (result, key, value) => {
        result[key] = value;
        return result;
      }
    );
    // ==> { X: 20, Y: 40 }


## Handling collisions

Since the mapping function returns a `[key, value]` pair, it's possible
that some of the returned keys collide with another. Since there's no
single answer that is correct for all cases when handling these collisions,
mapEntries expects an additional function that's used to define the 
properties in the resulting object, and this function is expected to
deal with the collisions.

A definition function takes the result object, a property name, and
a value, and is expected to return a new object containing the provided
key/value pair, if it can be attached to the result object. This function
may mutate the object, but pure functions are also supported.

Specialised forms of this function exist to cover common cases.
`mapEntries.overwrite` will have later key/value pairs overwrite earlier
ones with the same key, while `mapEntries.unique` will throw whenever
a collision happens.


## Caveats
 
`mapEntries` will not preserve the shape of the original object.
It treats objects as plain maps from String to some value. It ignores
things like prototypical delegation, symbols, and non-enumerable
properties.


@annotate: folktale.core.object.mapEntries.overwrite
---
Transforms own properties of an object using a mapping function.

This function is a specialised form of `mapEntries` that overwrites
duplicated keys when a collision happens. 


## Caveats

Because this function takes an object and maps over it, the result of a
transformation where keys collide is not defined in ECMAScript 5 and older,
as those engines don't define an ordering for key/value pairs in objects.
In ECMAScript 2015 properties that were inserted later will win over
properties that were inserted earlier.


@annotate: folktale.core.object.mapEntries.unique
---
Transforms own properties of an object using a mapping function.

This function is a specialised form of `mapEntries` that throws
when a key collision happens. Throwing makes this function potentially
unsafe to use, however it guarantees a consistent behaviour across
different ECMAScript versions and VMs.

