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

const compose = (f, g) => (value) => f(g(value));


module.exports = compose;


// -- Annotations ------------------------------------------------------
if (process.env.NODE_ENV !== "production") {
  require('metamagical/decorators')(
    compose,
    {
      name: 'compose',
      signature: 'compose(f, g)(value)',
      type: '((β) -> γ, (α) -> β) -> (α) -> γ',
      category: 'Combinators',
      tags: ['Lambda Calculus'],
      stability: 'stable',
      platforms: ['ECMAScript'],
      authors: ['Quildreen Motta'],
      module: 'folktale/core/lambda/compose',
      licence: 'MIT',
      documentation: `
Composes two functions.

The compose operation allows function composition. Basically, if you
have two functions, \`inc\` and \`double\`, you can compose them such
that you get a new function which has the characteristics of both:

    const inc = (x) => x + 1;
    const double = (x) => x * 2;
    const incDouble = compose(double, inc);

    incDouble(3)
    // => double(inc(3))
    // => 8

> **NOTE**  
> Composition is done from right to left, rather than left to right.
      `
    }
  );
}
