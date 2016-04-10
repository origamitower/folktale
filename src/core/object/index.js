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
  infix: require('./infix'),
  mapEntries: require('./map-entries'),
  mapValues: require('./map-values'),
  values: require('./values'),
  toPairs: require('./to-pairs'),
  fromPairs: require('./from-pairs')
};


// -- Annotations ------------------------------------------------------
if (process.env.NODE_ENV !== 'production') {
  module.exports[Symbol.for('@@meta:magical')] = {
    name: 'module folktale/core/object',
    category: 'Utilities for Native Values',
    stability: 'stable',
    platforms: ['ECMAScript'],
    authors: ['Quildreen Motta'],
    module: 'folktale/core/object',
    licence: 'MIT',
    documentation: `
Provides missing utilities for handling objects as dictionaries.


## Why?

Idiomatic JS code tends to use plain objects as records or dictionaries,
but there aren't many native facilities for handling them in that way.
This module tries to fill that gap.
    `
  };
}

