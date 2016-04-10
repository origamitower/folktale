//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Copyright (C) 2015-2016 Quildreen Motta.
// Licensed under the MIT licence.
//
// See LICENCE for licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

const define = Object.defineProperty;

const fromPairs = (pairs) =>
        pairs.reduce((r, [k, v]) => define(r, k, { value: v,
                                                   writable: true,
                                                   enumerable: true,
                                                   configurable: true
                                                  }),
                     {});

module.exports = fromPairs;


// -- Annotations ------------------------------------------------------
if (process.env.NODE_ENV !== 'production') {
  module.exports[Symbol.for('@@meta:magical')] = {
    name: 'fromPairs',
    signature: 'fromPairs(pairs)',
    type: '([String | Symbol, Any] -> { String | Symbol -> Any }',
    category: 'Converting',
    stability: 'stable',
    platforms: ['ECMAScript 5'],
    authors: ['Quildreen Motta'],
    module: 'folktale/core/object/fromPairs',
    licence: 'MIT',
    complexity: 'O(n), n length of the array',
    documentation: `
Constructs an object from an array of (key, value) pairs.

    fromPairs([['x', 10], ['y', 20]]);
    // => { x: 10, y: 20 }

The resulting object is a plain JavaScript object, inheriting from
\`Object.prototype\`.

The pairs are added to the object with \`Object.defineProperty\`, so no setters
defined in \`Object.prototype\` will be triggered during the process. All
properties are enumerable, writable, and configurable.

Properties are inserted in the object in the same order of the array. In an
ECMAScript 2015-compliant engine this means that the following equivalence
holds:

    Object.keys(fromPairs(xs)) === xs.map(([k, v]) => k)
    `
  };
}
