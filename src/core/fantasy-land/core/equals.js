//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// See LICENCE for licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

const { equals } = require('fantasy-land')
const warn = require('folktale/helpers/warn-deprecated')('equals')
const unsupported = require('folktale/helpers/unsupported-method')('equals')

module.exports = (b, a) => 
  typeof a[equals] === 'function' ? a[equals](b)
: typeof a.equals  === 'function' ? warn(a.equals(b))
: /*otherwise*/                     unsupported(a);
