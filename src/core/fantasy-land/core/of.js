//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// See LICENCE for licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

const { of:flOf } = require('folktale/helpers/fantasy-land');
const warn = require('folktale/helpers/warn-deprecated')('of');
const unsupported = require('folktale/helpers/unsupported-method')('of');


/*~
 * Constructs an applicative containing the given value.
 * ---
 * category: Fantasy Land
 * stability: experimental
 * authors:
 *   - "@boris-marinov"
 * 
 * type: |
 *   forall F, a:
 *     (F, a) => F a
 *   where F is Applicative
 */
const of = (f, a) =>
  typeof f[flOf] === 'function'             ? f[flOf ](a)
: typeof f.constructor[flOf] === 'function' ? f.constructor[flOf ](a)
: typeof f.of  === 'function'             ? warn(f.of(a))
: typeof f.constructor.of === 'function'  ? warn(f.constructor.of(a))
: /*otherwise*/                             unsupported(f);


module.exports = of;