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

const mapValues = require('../map-values');

module.exports = function _mapValues(transformation) {
  return mapValues(this, transformation);
};


// -- Annotations ------------------------------------------------------
if (process.env.NODE_ENV !== "production") {
  module.exports[Symbol.for('@@meta:magical')] = {
    name: 'mapValues',
    signature: '::mapValues(transformation)',
    type: '{ String -> α } . ((α) -> β) -> { String -> β }',
    category: 'Transforming',
    tags: ['Free Methods'],
    stability: 'experimental',
    platforms: ['ECMAScript.Next'],
    authors: ['Quildreen Motta'],
    module: 'folktale/core/object/infix/map-values',
    licence: 'MIT',
    seeAlso: [
      {
        type: 'entity',
        path: 'folktale/core/object/map-values',
        reason: 'The function counterpart of this free-method.'
      }
    ],
    documentation: `
Transforms values of an object with an unary function.

This is a wrapper over [[folktale/core/object/map-values]], which allows
one to use mapValues with the proposed This-Bind syntax:

    const pair = { x: 10, y: 20 };
    pair::mapValues(x => x * 2);
    // => { x: 20, y: 40 }
    // [equivalent to]:  mapValues.call(pair, x => x * 2)

See the original \`mapValues\` for more information.
    `
  };
}
