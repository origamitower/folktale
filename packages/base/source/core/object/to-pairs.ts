//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

/**
 * Converts an object to a list of (key, value) pairs.
 * 
 *     import toPairs from 'folktale/core/object/to-pairs'
 * 
 *     toPairs({ name: 'Alissa', age: 29 });
 *     //: => [['name', 'Alissa'], ['age', 29]]
 * 
 * @param object -- The object to convert
 * 
 * @complexity O(n) -- n is the number of own enumerable properties in `object`
 * @stability stable
 */
export default
function toPairs<A>(object: Dict<A>): Array<[string, A]> {
  return Object.keys(object).map(k => [k, object[k]] as [string, A]);
}
