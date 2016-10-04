//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// See LICENCE for licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

const { chain } = require('fantasy-land')
const warn = require('folktale/helpers/warn-deprecated')('chain')
const unsupported = require('folktale/helpers/unsupported-method')('chain')

module.exports = (f, a) => 
  typeof a[chain] === 'function' ?  a[chain](f)
: typeof a.chain  === 'function' ?  warn(a.chain(f))
: /*otherwise*/                     unsupported(a);
