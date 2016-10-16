//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// See LICENCE for licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------


/*~
 * Allows invoking methods of Fantasy Land structures without
 * worrying about the differences in multiple versions of the spec.
 * ---
 * category: Curried operations
 * stability: experimental
 * authors:
 *   - Quildreen Motta
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
