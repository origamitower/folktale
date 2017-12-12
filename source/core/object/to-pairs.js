//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------


/*~
 * stability : stable
 * authors:
 *   - Quildreen Motta
 *
 * complexity : O(n), n is the number of own enumerable properties
 * type: |
 *   (Object 'a) => Array (String or Symbol, 'a)
 */
const toPairs = (object) => Object.keys(object).map(k => [k, object[k]]);


// --[ Exports ]-------------------------------------------------------
module.exports = toPairs;
