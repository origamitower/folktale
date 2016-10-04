//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// See LICENCE for licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

const mapValues = require('folktale/core/object/map-values');
const curry = require('folktale/core/lambda/curry');

module.exports = mapValues(require('./core'), (f) => curry(f.length, f));
