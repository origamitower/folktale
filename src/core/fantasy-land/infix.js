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
 * category: Infix operations
 * stability: experimental
 * authors:
 *   - Quildreen Motta
 */
module.exports = {
  apply: require('./apply').infix,
  bimap: require('./bimap').infix,
  chain: require('./chain').infix,
  concat: require('./concat').infix,
  empty: require('./empty').infix,
  equals: require('./equals').infix,
  map: require('./map').infix,
  of: require('./of').infix
};
