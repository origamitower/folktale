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
 * Transforms pairs of (key, value) own properties in a plain object.
 *
 * The transformation takes a [key, value] pair, and is expected to return
 * a new [key, value] pair. The resulting object has not only its values
 * transformed, but also its keys:
 *
 *     const pair = { x: 10, y: 20 };
 *     mapEntries(
 *       pair,
 *       ([k, v]) => [k.toUpperCase(), v * 2],
 *       (r, k, v) => Object.assign(r, { [k]: v })
 *     );
 *     // => { X: 20, Y: 40 }
 *
 * > **NOTE**  
 * > The function expects you to provide a definition function, which will
 * > determine how to handle the mapping of the returned pairs. This is
 * > necessary because no single behaviour is always the right one for
 * > this. Common behaviours, such as `overwrite` older properties,
 * > and enforcing `unique` properties are provided as specialised
 * > frorms of this function.
 *
 *
 * > **NOTE**  
 * > The definition function may mutate the object.
 *
 *
 * > **WARNING**  
 * > [[mapEntries]] will not preserve the shape of the original object.
 * > It treats objects as plain maps from String to some value. It ignores
 * > things like prototypical delegation, symbols, and non-enumerable
 * > properties.
 *
 * ---------------------------------------------------------------------
 * name        : mapEntries
 * module      : folktale/core/object
 * copyright   : (c) 2015-2016 Quildreen Motta, and CONTRIBUTORS
 * licence     : MIT
 * repository  : https://github.com/origamitower/folktale
 *
 * category    : Transforming
 * stability   : stable
 * portability : portable
 * platforms:
 *   - ECMAScript 5
 *   - ECMAScript 3, with es5-shim
 *
 * maintainers:
 *   - Quildreen Motta <queen@robotlolita.me>
 *
 * authors:
 *   - Quildreen Motta
 *
 * complexity : O(n), n is the number of own enumerable properties
 * signature  : mapEntries(object, transform, define)
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


/*~
 * Transforms pairs of (key, value) own properties in a plain object.
 *
 * This function is a specialised form of [[mapEntries]] that overwrites
 * duplicated keys when a collision happens. Because of this, the result
 * of a transformation where keys collide is not defined in ECMAScript 5
 * and older, but in ECMAScript 2015 properties that were inserted later
 * will win over properties that were inserted earlier.
 *
 * ---------------------------------------------------------------------
 * name      : overwrite
 * category  : Transforming
 * stability : stable
 *
 * seeAlso:
 *   - type: entity
 *     path: folktale/core/object/map-entries .unique
 *     reason: Consistently throws when a collision happens.
 *
 * complexity : O(n), n is the number of own enumerable properties
 * signature  : overwrite(object, transform)
 * type: |
 *   (Object 'a, ((String, 'a)) => (String, 'b)) => Object 'b
 */
mapEntries.overwrite = (object, transform) =>
  mapEntries(object, transform, (result, key, value) => {
    result[key] = value;
    return result;
  });


/*~
 * Transforms pairs of (key, value) own properties in a plain object.
 *
 * This function is a specialised form of [[mapEntries]] that throws
 * when a key collision happens. Throwing makes this function potentially
 * unsafe to use, however it guarantees a consistent behaviour across
 * different ECMAScript versions and VMs.
 *
 * ---------------------------------------------------------------------
 * name      : unique
 * category  : Transforming
 * stability : stable
 *
 * seeAlso:
 *   - type: entity
 *     path: folktale/core/object/map-entries .overwrite
 *     reason: Overwrite keys when a collision happens.
 *
 * throws:
 *   Error: when the transform returns duplicate property names.
 *
 * complexity : O(n), n is the number of own enumerable properties
 * signature  : unique(object, transform)
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


module.exports = mapEntries;
