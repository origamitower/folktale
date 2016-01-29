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

function identity(value) {
  return value;
}

module.exports = identity;


// -- Annotations ------------------------------------------------------
if (process.env.NODE_ENV !== "production") {
  require('metamagical/decorators')(
    identity,
    {
      name: 'identity',
      signature: 'identity(value)',
      type: '(α) -> α',
      category: 'Combinators',
      tags: ['Lambda Calculus'],
      stability: 'locked',
      platforms: ['ECMAScript'],
      authors: ['Quildreen Motta'],
      module: 'folktale/core/lambda/identity',
      licence: 'MIT',
      examples: [function() {
        identity(2);    // => 2
        identity([3]);  // => [3]
      }],
      documentation: `
The identity combinator; always returns the argument given.

Identity combinators may work as an NO-OP, since it's a pure operation.
As such, they can be passed to any operation that expects a function
when you don't want the operation to do anything special with that
function.

A simple example is a \`bimap\` operation in an Either structure. You might want
to transform one side of the data structure, but leave the other side with the
same value:

    Either.Right(2).bimap(identity, (x) => x + 1);
    // => Either.Right(3)

    Either.Left(2).bimap(identity, (x) => x + 1);
    // => Either.Left(2)
      `
    }
  );
}
