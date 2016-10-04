//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// See LICENCE for licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

const { of } = require('fantasy-land')
const warn = require('folktale/helpers/warn-deprecated')('of')
const unsupported = require('folktale/helpers/unsupported-method')('of')

module.exports = (f, a) => 
  typeof f[of] === 'function'             ? f[of](a)
: typeof f.constructor[of] === 'function' ? f.constructor[of](a)
: typeof f.of  === 'function'             ? warn(f.of(a))
: typeof f.constructor.of === 'function'  ? warn(f.constructor.of(a))
: /*otherwise*/                             unsupported(f);
