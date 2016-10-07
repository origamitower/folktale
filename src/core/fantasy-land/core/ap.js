//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// See LICENCE for licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

const { ap } = require('folktale/helpers/fantasy-land');
const warn = require('folktale/helpers/warn-deprecated')('ap');
const unsupported = require('folktale/helpers/unsupported-method')('ap');

module.exports = (a, b) =>
  typeof a[ap] === 'function' ?  a[ap](b)
: typeof a.ap  === 'function' ?  warn(a.ap(b))
: /*otherwise*/                  unsupported(a);
