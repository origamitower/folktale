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

/*~
 * Applies the function inside an applicative to the value of another applicative.
 * ---
 * category: Fantasy Land
 * stability: experimental
 * authors:
 *   - "@boris-marinov"
 * 
 * type: |
 *   forall F, a, b:
 *     (F (a) => b, F a) => F b
 *   where F is Apply
 */
const apply = (a, b) =>
  typeof a[ap] === 'function' ?  b[ap](a)
: typeof a.ap  === 'function' ?  warn(a.ap(b))
: /*otherwise*/                  unsupported(a);


module.exports = apply;