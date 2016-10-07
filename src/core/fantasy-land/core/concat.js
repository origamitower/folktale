//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// See LICENCE for licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

const { concat } = require('folktale/helpers/fantasy-land');
const warn = require('folktale/helpers/warn-deprecated')('concat');
const unsupported = require('folktale/helpers/unsupported-method')('concat');

module.exports = (b, a) =>
  typeof a[concat] === 'function' ?  a[concat](b)
: typeof a.concat  === 'function' ?  warn(a.concat(b))
: /*otherwise*/                     unsupported(a);
