//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// See LICENCE for licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

const { concat:flConcat } = require('folktale/helpers/fantasy-land');
const warn = require('folktale/helpers/warn-deprecated')('concat');
const unsupported = require('folktale/helpers/unsupported-method')('concat');


/*~
 * Joins two semigroups.
 * ---
 * category: Fantasy Land
 * stability: experimental
 * authors:
 *   - "@boris-marinov"
 * 
 * type: |
 *   forall S, a:
 *     (S a, S a) => S a
 *   where S is Semigroup
 */
const concat = (b, a) =>
  typeof a[flConcat] === 'function' ?  a[flConcat](b)
: typeof a.concat  === 'function'   ?  warn(a.concat(b))
: /*otherwise*/                        unsupported(a);


module.exports = concat;
