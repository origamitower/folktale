//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// See LICENCE for licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

const { bimap:flBimap } = require('folktale/helpers/fantasy-land');
const curry = require('folktale/core/lambda/curry');
const warn = require('folktale/helpers/warn-deprecated')('bimap');
const unsupported = require('folktale/helpers/unsupported-method')('bimap');


const isNew = (a) => typeof a[flBimap] === 'function';
const isOld = (a) => typeof a.bimap === 'function';


/*~
 * Maps one function over each side of a Bifunctor.
 * ---
 * category: Fantasy Land
 * stability: experimental
 * authors:
 *   - "@boris-marinov"
 *   - Quildreen Motta
 * 
 * type: |
 *   forall F, a, b, c, d:
 *     (F a b, (a) => c, (b) => d) => F c d
 *   where F is Bifunctor
 */
const bimap = (bifunctor, transformLeft, transformRight) =>
  isNew(bifunctor) ?  bifunctor[flBimap](transformLeft, transformRight)
: isOld(bifunctor) ?  warn(bifunctor.bimap(transformLeft, transformRight))
: /*otherwise*/       unsupported(bifunctor);


/*~
 * Maps one function over each side of a Bifunctor.
 * ---
 * category: Convenience
 * stability: experimental
 * authors:
 *   - "@boris-marinov"
 *   - Quildreen Motta
 * 
 * type: |
 *   forall F, a, b, c, d:
 *     ((a) => c) => ((b) => d) => (F a b) => F c d
 *   where F is Bifunctor
 */
bimap.curried = curry(3, (transformLeft, transformRight, bifunctor) => 
  bimap(bifunctor, transformLeft, transformRight)
);


/*~
 * Maps one function over each side of a Bifunctor.
 * ---
 * category: Convenience
 * stability: experimental
 * authors:
 *   - Quildreen Motta
 * 
 * type: |
 *   forall F, a, b, c, d:
 *     (F a b).((a) => c, (b) => d) => F c d
 *   where F is Bifunctor
 */
bimap.infix = function(transformLeft, transformRight) {
  return bimap(this, transformLeft, transformRight);
};


module.exports = bimap;
