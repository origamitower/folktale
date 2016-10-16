//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// See LICENCE for licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

const { equals:flEquals } = require('folktale/helpers/fantasy-land');
const warn = require('folktale/helpers/warn-deprecated')('equals');
const unsupported = require('folktale/helpers/unsupported-method')('equals');


/*~
 * Compares two setoids for equality.
 * ---
 * category: Fantasy Land
 * stability: experimental
 * authors:
 *   - "@boris-marinov"
 * 
 * type: |
 *   forall S, a:
 *     (S a, S a) => Boolean
 *   where S is Setoid
 */
const equals = (b, a) =>
  typeof a[flEquals] === 'function' ? a[flEquals](b)
: typeof a.equals  === 'function'   ? warn(a.equals(b))
: /*otherwise*/                       unsupported(a);


module.exports = equals;
