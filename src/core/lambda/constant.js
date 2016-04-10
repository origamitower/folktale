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

const constant = (value) => (_) => value;


module.exports = constant;

// -- Annotations ------------------------------------------------------
if (process.env.NODE_ENV !== 'production') {
  module.exports[Symbol.for('@@meta:magical')] = {
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
  };
}
