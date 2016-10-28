//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// See LICENCE for licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------
//
const compose = require('./compose');
module.exports = (f, g) => (a) => compose(g, f)(a);
