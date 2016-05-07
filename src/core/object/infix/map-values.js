//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// See LICENCE for licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

const mapValues = require('../map-values');

/*~
 * Transforms values of an object with an unary function.
 *
 * This is a wrapper over [[folktale/core/object/map-values]], which allows
 * one to use mapValues with the proposed This-Bind syntax:
 *
 *     const pair = { x: 10, y: 20 };
 *     pair::mapValues(x => x * 2);
 *     // => { x: 20, y: 40 }
 *     // [equivalent to]:  mapValues.call(pair, x => x * 2)
 *
 * See the original `mapValues` for more information.
 *
 * ---------------------------------------------------------------------
 * name        : mapValues
 * module      : folktale/core/object/infix/map-values
 * copyright   : (c) 2015-2016 Quildreen Motta, and CONTRIBUTORS
 * licence     : MIT
 * repository  : https://github.com/origamitower/folktale
 *
 * category    : Transforming
 * stability   : experimental
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
 * seeAlso:
 *   - type: entity
 *     path: folktale/core/object/map-values
 *     reason: The function equivalent of this free-method.
 *
 * signature: object::mapValues(transformation)
 * type: |
 *   (Object 'a) . (('a) => 'b) => Object 'b
 */
module.exports = function _mapValues(transformation) {
  return mapValues(this, transformation);
};
