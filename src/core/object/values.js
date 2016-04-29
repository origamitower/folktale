//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// See LICENCE for licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

/*~
 * Returns the values for all own enumerable properties in an object.
 *
 * Objects in JavaScript are commonly used as dictionaries, but natively
 * there are no operations to work with them in that way. This function
 * allows one to extract the values from an object:
 *
 *     const pair = { x: 10, y: 20 };
 *     values(pair);
 *     // => [10, 20]  or  [20, 10]
 *
 * Inherited properties, and those that are not marked as enumerable, are
 * not returned in the resulting array:
 *
 *     const p1 = { z: 2 };
 *     const pair = Object.create(p1);
 *     pair.x = 10; pair.y = 20;
 *
 *     values(pair);
 *     // => [10, 20]  or  [20, 10]
 *
 *     // non-enumerable property x
 *     Object.defineProperty(p1, 'x', { value: 1 });
 *
 *     values(p1);
 *     // => [2]
 *
 *
 * > **NOTE**  
 * > While ECMAScript 2015 specifies that objects are ordered using
 * > insertion order, you're not guaranteed to get that behaviour in
 * > any non-ES2015 engine, so for all effects it's better to treat
 * > the result of this operation as an unordered collection.
 *
 * ---------------------------------------------------------------------
 * name        : values
 * module      : folktale/core/object/values
 * copyright   : (c) 2015-2016 Quildreen Motta, and CONTRIBUTORS
 * licence     : MIT
 * repository  : https://github.com/origamitower/folktale
 *
 * category    : Combining
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
 * complexity : O(n), n is the number of own enumerable properties.
 * signature  : values(object)
 * type: |
 *   (Object 'a) => Array 'a
 */
const values = (object) => Object.keys(object).map(k => object[k]);


module.exports = values;
