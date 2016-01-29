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

module.exports = {
  identity: require('./identity'),
  constant: require('./constant'),
  curry: require('./curry'),
  compose: require('./compose'),
  infix: require('./infix')
};


// -- Annotations ------------------------------------------------------
if (process.env.NODE_ENV !== "production") {
  module.exports[Symbol.for('@@meta:magical')] = {
    name: 'module folktale/core/lambda',
    category: 'Lambda Calculus',
    stability: 'stable',
    platforms: ['ECMAScript'],
    authors: ['Quildreen Motta'],
    module: 'folktale/core/lambda',
    licence: 'MIT',
    documentation: `
Essential functional combinators and higher-order functions derived from λ-calculus.

## Why?

Functional programming places heavy emphasis in composition (specially
function composition), but JavaScript lacks most of the built-in
functionality for composing and transforming functions in a composable
way. The \`folktale.core.lambda\` module fills this gap by providing
tools for composing functions, changing the shape of a function in
order to compose them in different ways, and currying/uncurrying.
    `
  };
}
