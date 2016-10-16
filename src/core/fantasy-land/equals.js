//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// See LICENCE for licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

const { equals:flEquals } = require('folktale/helpers/fantasy-land');
const curry = require('folktale/core/lambda/curry');
const warn = require('folktale/helpers/warn-deprecated')('equals');
const unsupported = require('folktale/helpers/unsupported-method')('equals');


const isNew = (a) => typeof a[flEquals] === 'function';
const isOld = (a) => typeof a.equals === 'function';


/*~
 * Compares two setoids for equality.
 * ---
 * category: Fantasy Land
 * stability: experimental
 * authors:
 *   - "@boris-marinov"
 *   - Quildreen Motta
 * 
 * type: |
 *   forall S, a:
 *     (S a, S a) => Boolean
 *   where S is Setoid
 */
const equals = (setoidLeft, setoidRight) =>
  isNew(setoidLeft) ?  setoidLeft[flEquals](setoidRight)
: isOld(setoidLeft) ?  warn(setoidLeft.equals(setoidRight))
: /*otherwise*/        unsupported(setoidLeft);


/*~
 * Compares two setoids for equality.
 * ---
 * category: Convenience
 * stability: experimental
 * authors:
 *   - "@boris-marinov"
 *   - Quildreen Motta
 * 
 * type: |
 *   forall S, a:
 *     (S a) => (S a) => Boolean
 *   where S is Setoid
 */
equals.curried = curry(2, (setoidRight, setoidLeft) => 
  equals(setoidLeft, setoidRight)
);


/*~
 * Compares two setoids for equality.
 * ---
 * category: Convenience
 * stability: experimental
 * authors:
 *   - Quildreen Motta
 * 
 * type: |
 *   forall S, a:
 *     (S a).(S a) => Boolean
 *   where S is Setoid
 */
equals.infix = function(aSetoid) {
  return equals(this, aSetoid);
};


module.exports = equals;
