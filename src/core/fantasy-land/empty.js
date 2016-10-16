//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// See LICENCE for licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

const { empty:flEmpty } = require('folktale/helpers/fantasy-land');
const curry = require('folktale/core/lambda/curry');
const warn = require('folktale/helpers/warn-deprecated')('empty');
const unsupported = require('folktale/helpers/unsupported-method')('empty');


const isNew = (a) => typeof a[flEmpty] === 'function';
const isCtorNew = (a) => typeof a.constructor[flEmpty] === 'function';
const isOld = (a) => typeof a.empty === 'function';
const isCtorOld = (a) => typeof a.constructor.empty === 'function';


/*~
 * Returns the identity object for a monoid.
 * ---
 * category: Fantasy Land
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
 * Returns the identity object for a monoid.
 * ---
 * category: Convenience
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
empty.curried = curry(empty);


/*~
 * Returns the identity object for a monoid.
 * ---
 * category: Convenience
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
