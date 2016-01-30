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
  lambda: require('./lambda'),
  adt: require('./adt')
};


// -- Annotations ------------------------------------------------------
if (process.env.NODE_ENV !== "production") {
  module.exports[Symbol.for('@@meta:magical')] = {
    name: 'module folktale/core',
    category: 'Functional Programming',
    stability: 'stable',
    platforms: ['ECMAScript'],
    authors: ['Quildreen Motta'],
    module: 'folktale/core',
    licence: 'MIT',
    documentation: `
The \`folktale.core\` module provides essential building blocks and
compositional operations which are likely to be used by most programs,
and which don't quite fit in more specific categories (like the \`data\`
module).
    `
  };
}
