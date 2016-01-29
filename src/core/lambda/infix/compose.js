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

const compose = require('../compose');

module.exports = function _compose(nextFunction) {
  return compose(nextFunction, this);
};


// -- Annotations ------------------------------------------------------
if (process.env.NODE_ENV !== "production") {
  require('metamagical/decorators')(
    module.exports,
    {
      name: 'compose',
      signature: '::compose(nextFunction)',
      type: '((α) -> β) . ((β) -> γ) -> (α) -> γ',
      category: 'Combinators',
      tags: ['Lambda Calculus', 'Free Methods'],
      stability: 'experimental',
      platforms: ['ECMAScript.Next'],
      authors: ['Quildreen Motta'],
      module: 'folktale/core/lambda/infix/compose',
      licence: 'MIT',
      seeAlso: [
        {
          type: 'entity',
          path: 'folktale/core/lambda/compose',
          reason: 'The function counterpart of this free-method.'
        }
      ],
      documentation: `
Composes two functions.

This is a wrapper over [[folktale/core/lambda/compose]], which allows
one to use compose with the proposed This-Bind syntax:

    const inc = (x) => x + 1;
    const double = (x) => x * 2;
    const incDouble = inc::compose(double);
    // [equivalent to]:  compose(double, inc)

See the original \`compose\` for more information.
      `
    }
  );
}
