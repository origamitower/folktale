//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

const hasOwnProperty = Object.prototype.hasOwnProperty;

/*~
 * stability: stable
 * authors:
 *   - Quildreen Motta
 *
 * complexity : O(n), n is the number of own enumerable properties
 * type: |
 *   (
 *     object    : Object 'a,
 *     transform : ((String, 'a)) => (String, 'b),
 *     define    : (('x : Object 'b), String, 'b) => Object 'b :: mutates 'x
 *   ) => Object 'b
 */
const mapEntries = (object, transform, define) =>
        Object.keys(object).reduce((result, key) => {
          const [newKey, newValue] = transform([key, object[key]]);
          return define(result, newKey, newValue);
        }, {});


// --[ Convenience ]---------------------------------------------------
/*~
 * stability: stable
 * authors:
 *   - Quildreen Motta
 *
 * complexity : O(n), n is the number of own enumerable properties
 * type: |
 *   (Object 'a, ((String, 'a)) => (String, 'b)) => Object 'b
 */
mapEntries.overwrite = (object, transform) =>
  mapEntries(object, transform, (result, key, value) => {
    result[key] = value;
    return result;
  });


/*~
 * stability: stable
 * authors:
 *   - Quildreen Motta
 *
 * throws:
 *   Error: when the transform returns duplicate property names.
 *
 * complexity : O(n), n is the number of own enumerable properties
 * type: |
 *   (Object 'a, ((String, 'a)) => (String, 'b)) => Object 'b :: throws Error
 */
mapEntries.unique = (object, transform) =>
  mapEntries(object, transform, (result, key, value) => {
    if (result::hasOwnProperty(key)) {
      throw new Error(`The property ${key} already exists in the resulting object.`);
    }
    result[key] = value;
    return result;
  });


// --[ Exports ]-------------------------------------------------------
module.exports = mapEntries;
