//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// See LICENCE for licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

const { map:flMap } = require('folktale/helpers/fantasy-land');
const warn = require('folktale/helpers/warn-deprecated')('map');
const unsupported = require('folktale/helpers/unsupported-method')('map');


/*~
 * Transforms the contents of a Functor.
 * ---
 * category: Fantasy Land
 * stability: experimental
 * authors:
 *   - "@boris-marinov"
 * 
 * type: |
 *   forall F, a, b:
 *     ((a) => b, F a) => F b
 *   where F is Functor
 */
const map = (f, a) =>
  typeof a[map] === 'function' ? a[map](f)
: typeof a.map  === 'function' ? warn(a.map(f))
: /*otherwise*/                  unsupported(a);


module.exports = map;
