//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// See LICENCE for licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

const { concat:flConcat } = require('folktale/helpers/fantasy-land');
const curry = require('folktale/core/lambda/curry');
const warn = require('folktale/helpers/warn-deprecated')('concat');
const unsupported = require('folktale/helpers/unsupported-method')('concat');

const isNewSemigroup = (a) => typeof a[flConcat] === 'function';
const isOldSemigroup = (a) => typeof a.concat === 'function'; 


/*~
 * Joins two semigroups.
 * ---
 * category: Fantasy Land
 * stability: experimental
 * authors:
 *   - "@boris-marinov"
 *   - Quildreen Motta
 * 
 * type: |
 *   forall S, a:
 *     (S a, S a) => S a
 *   where S is Semigroup
 */
const concat = (semigroupLeft, semigroupRight) =>
  isNewSemigroup(semigroupLeft) ?  semigroupLeft[flConcat](semigroupRight)
: isOldSemigroup(semigroupLeft) ?  warn(semigroupLeft.concat(semigroupRight))
: /*otherwise*/                    unsupported(semigroupLeft);


/*~
 * Joins two semigroups.
 * ---
 * category: Convenience
 * stability: experimental
 * authors:
 *   - "@boris-marinov"
 *   - Quildreen Motta
 * 
 * type: |
 *   forall S, a:
 *     (S a) => (S a) => S a
 *   where S is Semigroup
 */
concat.curried = curry((semigroupRight, semigroupLeft) => 
  concat(semigroupLeft, semigroupRight)
);


/*~
 * Joins two semigroups.
 * ---
 * category: Convenience
 * stability: experimental
 * authors:
 *   - Quildreen Motta
 * 
 * type: |
 *   forall S, a:
 *     (S a).(S a) => S a
 *   where S is Semigroup
 */
concat.infix = function(aSemigroup) {
  return concat(this, aSemigroup);
};


module.exports = concat;
