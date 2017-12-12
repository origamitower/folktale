//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

const { empty: flEmpty } = require('folktale/helpers/fantasy-land');
const curry = require('folktale/core/lambda/curry');
const warn = require('folktale/helpers/warn-deprecated-method')('empty');
const unsupported = require('folktale/helpers/unsupported-method')('empty');


const isNew = (a) => typeof a[flEmpty] === 'function';
const isCtorNew = (a) => typeof a.constructor[flEmpty] === 'function';
const isOld = (a) => typeof a.empty === 'function';
const isCtorOld = (a) => typeof a.constructor.empty === 'function';


/*~
 * stability: experimental
 * authors:
 *   - "@boris-marinov"
 *   - Quildreen Motta
 * 
 * type: |
 *   forall M, a:
 *     (M) => M a
 *   where M is Monoid 
 */
const empty = (monoid) =>
  isNew(monoid)     ?  monoid[flEmpty]()
: isCtorNew(monoid) ?  monoid.constructor[flEmpty]()
: isOld(monoid)     ?  warn(monoid.empty())
: isCtorOld(monoid) ?  warn(monoid.constructor.empty())
: /*otherwise*/        unsupported(monoid);


/*~
 * stability: experimental
 * authors:
 *   - "@boris-marinov"
 *   - Quildreen Motta
 * 
 * type: |
 *   forall M, a:
 *     (M) => M a
 *   where M is Monoid 
 */
empty.curried = curry(1, empty);      // eslint-disable-line no-magic-numbers


/*~
 * stability: experimental
 * authors:
 *   - Quildreen Motta
 * 
 * type: |
 *   forall M, a:
 *     (M).() => M a
 *   where M is Monoid 
 */
empty.infix = function() {
  return empty(this);
};


module.exports = empty;
