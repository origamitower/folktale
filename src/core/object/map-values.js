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

const mapValues = (object, transformation) => {
  const keys = Object.keys(object);
  const result = {};

  for (let i = 0; i < keys.length; ++i) {
    const key = keys[i];
    result[key] = transformation(object[key]);
  }

  return result;
};


module.exports = mapValues;


// -- Annotations ------------------------------------------------------
if (process.env.NODE_ENV !== 'production') {
  mapValues[Symbol.for('@@meta:magical')] = {
    name: 'mapValues',
    signature: 'mapValues(object, transformation)',
    type: '({ String -> α }, (α) -> β) -> { String -> β }',
    category: 'Transforming',
    stability: 'stable',
    platforms: ['ECMAScript 5'],
    authors: ['Quildreen Motta'],
    portability: 'Supported in older ES VMs with es5-shim',
    module: 'folktale/core/object/map-values',
    complexity: 'O(n), n is the number of own enumerable properties',
    documentation: `
Transforms values of an object with an unary function.

The transformation works on the values of each own, enumerable
property of the given object. Inherited and non-enumerable
properties are ignored by this function:

    const pair = { x: 10, y: 20 };
    mapValues(pair, x => x * 2);
    // => { x: 20, y: 40 }

> **WARNING**
> [[mapValues]] will not preserve the shape of the original object.
> It treats objects as plain maps from String to some value, and
> ignores things like prototypical delegation, symbols, and non-enumerable
> properties.
    `
  };
}
