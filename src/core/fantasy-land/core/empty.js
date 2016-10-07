//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// See LICENCE for licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

const { empty } = require('folktale/helpers/fantasy-land');
const warn = require('folktale/helpers/warn-deprecated')('empty');
const unsupported = require('folktale/helpers/unsupported-method')('empty');

module.exports = (a) =>
  typeof a[empty] === 'function'             ? a[empty]()
: typeof a.constructor[empty] === 'function' ? a.constructor[empty]()
: typeof a.empty  === 'function'             ? warn(a.empty())
: typeof a.constructor.empty === 'function'  ? warn(a.constructor.empty())
: /*otherwise*/                                unsupported(a);
