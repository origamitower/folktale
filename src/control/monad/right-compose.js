//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// See LICENCE for licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------
//
const compose = require('./compose')
const curry = require('folktale/core/lambda/curry/')
module.exports = curry(3, (f, g, a) => compose(g, f, a))
