//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

const { of: flOf } = require('folktale/helpers/fantasy-land');
const curry = require('folktale/core/lambda/curry');
const warn = require('folktale/helpers/warn-deprecated-method')('of');
const unsupported = require('folktale/helpers/unsupported-method')('of');


const isNew = (a) => typeof a[flOf] === 'function';
const isCtorNew = (a) => typeof a.constructor[flOf] === 'function';
const isOld = (a) => typeof a.of === 'function';
const isCtorOld = (a) => typeof a.constructor.of === 'function';


/*~
 * stability: experimental
 * authors:
 *   - "@boris-marinov"
 *   - Quildreen Motta
 * 
 * type: |
 *   forall F, a:
 *     (F, a) => F a
 *   where F is Applicative
 */
const of = (applicative, value) =>
  isNew(applicative)     ?  applicative[flOf](value)
: isCtorNew(applicative) ?  applicative.constructor[flOf](value)
: isOld(applicative)     ?  warn(applicative.of(value))
: isCtorOld(applicative) ?  warn(applicative.constructor.of(value))
: /*otherwise*/             unsupported(applicative);


/*~
 * stability: experimental
 * authors:
 *   - "@boris-marinov"
 *   - Quildreen Motta
 * 
 * type: |
 *   forall F, a:
 *     (F) => (a) => F a
 *   where F is Applicative
 */
of.curried = curry(2, of);      // eslint-disable-line no-magic-numbers


/*~
 * stability: experimental
 * authors:
 *   - Quildreen Motta
 * 
 * type: |
 *   forall F, a:
 *     (F).(a) => F a
 *   where F is Applicative
 */
of.infix = function(value) {
  return of(this, value);
};


module.exports = of;
