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

const curry = require('../curry');

module.exports = function _curry(arity) {
  return curry(arity, this);
};


// -- Annotations ------------------------------------------------------
if (process.env.NODE_ENV !== "production") {
  require('metamagical/decorators')(
    module.exports,
    {
      name: 'curry',
      signature: '::curry(arity)',
      type: '((α₁, α₂, ..., αₙ) -> β) . (Number) -> (α₁) -> (α₂) -> ... -> (αₙ) -> β',
      category: 'Currying',
      tags: ['Lambda Calculus', 'Free Methods'],
      stability: 'experimental',
      platforms: ['ECMAScript.Next'],
      authors: ['Quildreen Motta'],
      module: 'folktale/core/lambda/infix/curry',
      licence: 'MIT',
      seeAlso: [
        {
          type: 'entity',
          path: 'folktale/core/lambda/curry',
          reason: 'The function counterpart of this free-method.'
        }
      ],
      documentation: `
Transforms functions on tuples into curried functions.

This is a wrapper over [[folktale/core/lambda/curry]], which allows one
to use curry with the proposed This-Bind syntax:

    const add = (x, y) => x + y;
    add::curry(2)
    // [equivalent to]:  curry(2, add)

See the original \`curry\` function for more information.
      `
    }
  );
}
