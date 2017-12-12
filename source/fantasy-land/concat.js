//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

const { concat: flConcat } = require('folktale/helpers/fantasy-land');
const curry = require('folktale/core/lambda/curry');
const warn = require('folktale/helpers/warn-deprecated-method')('concat');
const unsupported = require('folktale/helpers/unsupported-method')('concat');

const isNewSemigroup = (a) => typeof a[flConcat] === 'function';
const isOldSemigroup = (a) => typeof a.concat === 'function'; 


/*~
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
concat.curried = curry(2, (semigroupRight, semigroupLeft) =>    // eslint-disable-line no-magic-numbers
  concat(semigroupLeft, semigroupRight)
);


/*~
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
