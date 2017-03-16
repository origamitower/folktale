@annotate: folktale.core.object.mapValues
category: Transforming
---
Transforms values of an object with an unary function.

The transformation works on the values of each own, enumerable
property of the given object. Inherited and non-enumerable
properties are ignored by this function.


## Example::

    const mapValues = require('folktale/core/object/map-values');

    const pair = { x: 10, y: 20 };
    mapValues(pair, x => x * 2);
    // ==> { x: 20, y: 40 }


## Caveats

`mapValues` will not preserve the shape of the original object.
It treats objects as plain maps from String to some value, and
ignores things like prototypical delegation, symbols, and non-enumerable
properties.


@annotate: folktale.core.object.mapValues.infix
category: Convenience
---
Conveniently transforms values in an object using the This-Binding syntax.

This is a free-method version of `mapValues` that applies the `this`
argument first, then the function it takes as argument. It's meant to
be used with the [This-Binding Syntax][es-bind] proposal::

    const map = require('folktale/core/object/map-values').infix;

    const pair = { x: 10, y: 20 };
    pair::map(x => x * 2);
    // ==> { x: 20, y: 40 }

[es-bind]: https://github.com/zenparsing/es-function-bind

