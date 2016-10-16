//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// See LICENCE for licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

const { ap } = require('folktale/helpers/fantasy-land');
const curry = require('folktale/core/lambda/curry');
const warn = require('folktale/helpers/warn-deprecated')('ap');
const unsupported = require('folktale/helpers/unsupported-method')('ap');

const isNew = (a) => typeof a[ap] === 'function';
const isOld = (a) => typeof a.ap === 'function';

/*~
 * Applies the function inside an applicative to the value of another applicative.
 * ---
 * category: Fantasy Land
 * stability: experimental
 * authors:
 *   - "@boris-marinov"
 *   - Quildreen Motta
 * 
 * type: |
 *   forall F, a, b:
 *     (F (a) => b, F a) => F b
 *   where F is Apply
 */
const apply = (applicativeFunction, applicativeValue) =>
  isNew(applicativeValue)    ?  applicativeValue[ap](applicativeFunction)
: isOld(applicativeFunction) ?  warn(applicativeFunction.ap(applicativeValue))
: /*otherwise*/                 unsupported(applicativeFunction);


/*~
 * Applies the function inside an applicative to the value of another applicative.
 * ---
 * category: Convenience
 * stability: experimental
 * authors:
 *   - "@boris-marinov"
 *   - Quildreen Motta
 * 
 * type: |
 *   forall F, a, b:
 *     (F (a) => b) => (F a) => F b
 *   where F is Apply
 */
apply.curried = curry(2, apply);


/*~
 * Applies the function inside an applicative to the value of another applicative.
 * ---
 * category: Convenience
 * stability: experimental
 * authors:
 *   - Quildreen Motta
 * 
 * type: |
 *   forall F, a, b:
 *     (F (a) => b).(F a) => F b
 *   where F is Apply
 */
apply.infix = function(applicativeValue) {
  return apply(this, applicativeValue);
};


module.exports = apply;
