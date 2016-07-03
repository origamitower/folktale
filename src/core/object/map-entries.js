//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// See LICENCE for licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

const hasOwnProperty = Object.prototype.hasOwnProperty;

/*~
 * Transforms own properties of an object using a mapping function.
 *
 * The transformation takes a `[key, value]` pair, and is expected to return
 * a new `[key, value]` pair. The resulting object has not only its values
 * transformed, but also its keys.
 * 
 * 
 * ## Example::
 *
 *     const pair = { x: 10, y: 20 };
 *     mapEntries(
 *       pair,
 *       ([key, value]) => [key.toUpperCase(), value * 2],
 *       (result, key, value) => {
 *         result[key] = value;
 *         return result;
 *       }
 *     );
 *     // ==> { X: 20, Y: 40 }
 *
 * 
 * ## Handling collisions
 * 
 * Since the mapping function returns a `[key, value]` pair, it's possible
 * that some of the returned keys collide with another. Since there's no
 * single answer that is correct for all cases when handling these collisions,
 * mapEntries expects an additional function that's used to define the 
 * properties in the resulting object, and this function is expected to
 * deal with the collisions.
 * 
 * A definition function takes the result object, a property name, and
 * a value, and is expected to return a new object containing the provided
 * key/value pair, if it can be attached to the result object. This function
 * may mutate the object, but pure functions are also supported.
 * 
 * Specialised forms of this function exist to cover common cases.
 * `mapEntries.overwrite` will have later key/value pairs overwrite earlier
 * ones with the same key, while `mapEntries.unique` will throw whenever
 * a collision happens.
 * 
 * 
 * ## Caveats
 *  
 * `mapEntries` will not preserve the shape of the original object.
 * It treats objects as plain maps from String to some value. It ignores
 * things like prototypical delegation, symbols, and non-enumerable
 * properties.
 *
 * ---
 * category    : Transforming
 * stability   : stable
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
 * Transforms own properties of an object using a mapping function.
 *
 * This function is a specialised form of `mapEntries` that overwrites
 * duplicated keys when a collision happens. 
 * 
 * 
 * ## Caveats
 * 
 * Because this function takes an object and maps over it, the result of a
 * transformation where keys collide is not defined in ECMAScript 5 and older,
 * as those engines don't define an ordering for key/value pairs in objects.
 * In ECMAScript 2015 properties that were inserted later will win over
 * properties that were inserted earlier.
 *
 * ---
 * category  : Transforming
 * stability : stable
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
 * Transforms own properties of an object using a mapping function.
 *
 * This function is a specialised form of `mapEntries` that throws
 * when a key collision happens. Throwing makes this function potentially
 * unsafe to use, however it guarantees a consistent behaviour across
 * different ECMAScript versions and VMs.
 *
 * ---
 * category  : Transforming
 * stability : stable
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
