//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

const { equals: flEquals } = require('folktale/helpers/fantasy-land');
const curry = require('folktale/core/lambda/curry');
const warn = require('folktale/helpers/warn-deprecated-method')('equals');
const unsupported = require('folktale/helpers/unsupported-method')('equals');


const isNew = (a) => typeof a[flEquals] === 'function';
const isOld = (a) => typeof a.equals === 'function';


/*~
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
equals.curried = curry(2, (setoidRight, setoidLeft) =>    // eslint-disable-line no-magic-numbers
  equals(setoidLeft, setoidRight)
);


/*~
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
