//---------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// See LICENCE for licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//---------------------------------------------------------------------

/*~
 * ---
 * category  : Transforming
 * stability : stable
 * authors:
 *   - Quildreen Motta
 *
 * complexity: O(n), n is the number of own enumerable properties.
 * type: |
 *   (Object 'a, ('a) => 'b) => Object 'b
 */
const mapValues = (object, transformation) => {
  const keys = Object.keys(object);
  const result = {};

  for (let i = 0; i < keys.length; ++i) {
    const key = keys[i];
    result[key] = transformation(object[key]);
  }

  return result;
};


// --[ Convenience ]---------------------------------------------------

/*~
 * ---
 * category  : Convenience
 * stability : experimental
 * authors:
 *   - Quildreen Motta
 * 
 * complexity: O(n), n is the number of own enumerable properties.
 * type: |
 *   (Object 'a) . (('a) => 'b) => Object 'b
 */
mapValues.infix = function(transformation) {
  return mapValues(this, transformation);
};


// --[ Exports ]-------------------------------------------------------
module.exports = mapValues;
