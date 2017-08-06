//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

/**
 * Converts an object to an array of its values.
 * 
 * @param object -- The object that'll be converted
 * 
 * @complexity O(n) -- n is the number of own enumerable properties in `object`
 * @stability stable
 */
export default
function values<A>(object: Dict<A>): Array<A> {
  return Object.keys(object).map(k => object[k]);
}
