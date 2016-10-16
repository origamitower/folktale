//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// See LICENCE for licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------


/*~
 * Method versions of the fantasy-land functions, supporting the
 * `structure::fn(...)` syntax.
 * ---
 * name: module folktale/core/fantasy-land/infix
 * category: Convenience
 * stability: experimental
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
