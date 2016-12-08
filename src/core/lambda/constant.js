//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// See LICENCE for licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

/*~
 * ---
 * category  : Combinators
 * stability : stable
 *
 * authors:
 *   - Quildreen Motta
 *
 * type: |
 *   ('a) => ('b) => 'a
 */
const constant = (value) => (_) => value;


// --[ Exports ]-------------------------------------------------------
module.exports = constant;
