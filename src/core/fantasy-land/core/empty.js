//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// See LICENCE for licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

const { empty:flEmpty } = require('folktale/helpers/fantasy-land');
const warn = require('folktale/helpers/warn-deprecated')('empty');
const unsupported = require('folktale/helpers/unsupported-method')('empty');


/*~
 * Returns the identity object for a monoid.
 * ---
 * category: Fantasy Land
 * stability: experimental
 * authors:
 *   - "@boris-marinov"
 * 
 * type: |
 *   forall M, a:
 *     (M) => M a
 *   where M is Monoid 
 */
const empty = (a) =>
  typeof a[flEmpty] === 'function'             ? a[flEmpty]()
: typeof a.constructor[flEmpty] === 'function' ? a.constructor[flEmpty]()
: typeof a.empty  === 'function'               ? warn(a.empty())
: typeof a.constructor.empty === 'function'    ? warn(a.constructor.empty())
: /*otherwise*/                                  unsupported(a);


module.exports = empty;
