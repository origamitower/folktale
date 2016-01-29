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

function constant(value) {
  return function(_) {
    return value;
  };
}

module.exports = constant;

// -- Annotations ------------------------------------------------------
if (process.env.NODE_ENV !== "production") {
  require('metamagical/decorators')(
    constant,
    {
      name: 'constant',
      signature: 'constant(value)(_)',
      type: '(α) -> (β) -> α',
      category: 'Combinators',
      tags: ['Lambda Calculus'],
      stability: 'locked',
      platforms: ['ECMAScript'],
      authors: ['Quildreen Motta'],
      module: 'folktale/core/lambda/constant',
      licence: 'MIT',
      examples: [function() {
        constant(3)(2);              // => 3
        [1, 2, 3].map(constant(0));  // => [0, 0, 0]
      }],
      documentation: `
The constant combinator; always returns the first argument given.

Constant combinators can be passed to higher-order operations if you
want to provide a plain value, but the operation expects a function
providing a value:

    [1, 2, 3].map(constant(0))
    // => [0, 0, 0]

But in most cases you should consider using an arrow function instead:

    [1, 2, 3].map(_ => 0)
    // => [0, 0, 0]
      `
    }
  );
}
