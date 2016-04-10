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
  mapValues: require('./map-values')
};


// -- Annotations ------------------------------------------------------
if (process.env.NODE_ENV !== 'production') {
  module.exports[Symbol.for('@@meta:magical')] = {
    name: 'module folktale/core/object/infix',
    category: 'Convenience',
    stability: 'experimental',
    platforms: ['ECMAScript'],
    tags: ['Free Methods', 'Infix'],
    authors: ['Quildreen Motta'],
    module: 'folktale/core/object/infix',
    licence: 'MIT',
    documentation: `
Core.Object operations as free methods.

The proposed [This-Bind syntax](https://github.com/zenparsing/es-function-bind)
allows free methods (functions that expect a special receiver object,
but aren't attached to that receiver object) to be called with a
more pleasant infix syntax, such that:

    map.call([1, 2, 3], x => x + 1);

Becomes:

    [1, 2, 3]::map(x => x + 1);

Which is pretty close to how methods attached to an object are called:

    [1, 2, 3].map(x => x + 1)

Since it's desirable for some functions to be used in an infix notation
to aid in code clarity, this method allows some functions from the
Core.Object module to be used in such a fashion.

> **NOTE**  
> This module is marked as experimental because This-Bind syntax is not
> yet in the ECMAScript language. It might not get specified with its
> current semantics.
    `
  };
}
