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
  core: require('./core')
};


// -- Annotations ------------------------------------------------------
if (process.env.NODE_ENV !== "production") {
  require('metamagical/decorators')(
    module.exports,
    {
      name: 'module folktale',
      category: 'Functional Programming',
      stability: 'stable',
      platforms: ['ECMAScript'],
      authors: ['Quildreen Motta'],
      module: 'folktale',
      licence: 'MIT',
      documentation: `
Folktale is a suite of libraries for generic functional programming in
JavaScript. It allows the construction of elegant and robust programs,
with highly reusable abstractions that can help keep larger code bases
more maintainable.
      `
    }
  );
}
