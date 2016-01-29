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

module.exports = function(transform) {
  return (x, y) => this(transform(x), transform(y));
};


// -- Annotations ------------------------------------------------------
if (process.env.NODE_ENV !== "production") {
  module.exports[Symbol.for('@@meta:magical')] = {
    name: 'on',
    signature: '::on(transform)(x, y)',
    type: '((β, β) -> γ) . ((α) -> β) -> (α, α) -> γ',
    category: 'Combinators',
    tags: ['Lambda Calculus', 'Free Methods'],
    stability: 'experimental',
    platforms: ['ECMAScript.Next'],
    authors: ['Quildreen Motta'],
    module: 'folktale/core/lambda/infix/on',
    licence: 'MIT',
    documentation: `
Applies an unary function to both sides of a binary function.

[[on]] is a combinator that's mostly useful for things like sorting,
zipping, and other higher-order operations that expect binary
operations. It allows one to define a transformation on the arguments
in a way that is pretty clear:

    let xss = [[1, 2], [3, 1], [-2, 4]];

    function compare(a, b) {
      return a < b?     -1
      :      a === b?    0
      :      /* a> b */  1
    }

    function sortBy(f, xs) {
      return xs.slice().sort(f)
    }

    sortBy(compare::on(first), xs)
    // => [[-2, 4], [1, 2], [3, 1]]
    `
  };
}
