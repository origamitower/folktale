//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// See LICENCE for licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

const { bimap:flBimap } = require('folktale/helpers/fantasy-land');
const warn = require('folktale/helpers/warn-deprecated')('bimap');
const unsupported = require('folktale/helpers/unsupported-method')('bimap');


/*~
 * Maps one function over each side of a Bifunctor.
 * ---
 * category: Fantasy Land
 * stability: experimental
 * authors:
 *   - "@boris-marinov"
 * 
 * type: |
 *   forall F, a, b, c, d:
 *     ((a) => c, (b) => d, F a b) => F c d
 *   where F is Bifunctor
 */
const bimap = (f, g, a) =>
  typeof a[flBimap] === 'function' ? a[flBimap](f, g)
: typeof a.bimap  === 'function'   ? warn(a.bimap(f, g))
: /*otherwise*/                      unsupported(a);


module.exports = bimap;