//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// See LICENCE for licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------


/*~
 * Curried versions of the fantasy-land functions.
 * ---
 * name: module folktale/core/fantasy-land/curried
 * category: Convenience
 * stability: experimental
 */
module.exports = {
  apply: require('./apply').curried,
  bimap: require('./bimap').curried,
  chain: require('./chain').curried,
  concat: require('./concat').curried,
  empty: require('./empty').curried,
  equals: require('./equals').curried,
  map: require('./map').curried,
  of: require('./of').curried
};
