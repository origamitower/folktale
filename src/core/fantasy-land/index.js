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
 * category: Fantasy Land
 * stability: experimental
 * authors:
 *   - "@boris-marinov"
 */
module.exports = {
  ...require('./core'),
  curried: require('./curried')
};
