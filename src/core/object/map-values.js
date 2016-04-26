//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// See LICENCE for licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

/*~
 * Transforms values of an object with an unary function.
 *
 * The transformation works on the values of each own, enumerable
 * property of the given object. Inherited and non-enumerable
 * properties are ignored by this function:
 *
 *     const pair = { x: 10, y: 20 };
 *     mapValues(pair, x => x * 2);
 *     // => { x: 20, y: 40 }
 *
 * > **WARNING**
 * > [[mapValues]] will not preserve the shape of the original object.
 * > It treats objects as plain maps from String to some value, and
 * > ignores things like prototypical delegation, symbols, and non-enumerable
 * > properties.
 *
 * ---------------------------------------------------------------------
 * name: mapValues
 * module: folktale/core/object/map-values
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
 * complexity : O(n), n is the number of own enumerable properties.
 * signature  : mapValues(object, transformation)
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


module.exports = mapValues;
