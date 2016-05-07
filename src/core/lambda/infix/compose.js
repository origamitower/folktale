//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// See LICENCE for licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

const compose = require('../compose');

/*~
 * Composes two functions.
 *
 * This is a wrapper over [[folktale/core/lambda/compose]], which allows
 * one to use compose with the proposed This-Bind syntax:
 *
 *     const inc    = (x) => x + 1;
 *     const double = (x) => x * 2;
 *     const incDouble = inc::compose(double);
 *     // [equivalent to]:  compose(double, inc)
 *
 * See the original `compose` for more information.
 *
 * --------------------------------------------------------------------
 * name        : compose
 * module      : folktale/core/lambda/compose
 * copyright   : (c) 2015-2016 Quildreen Motta, and CONTRIBUTORS
 * licence     : MIT
 * repository  : https://github.com/origamitower/folktale
 *
 * category    : Combining
 * stability   : experimental
 * portability : portable
 * platforms:
 *   - ECMAScript 3
 *
 * maintainers:
 *   - Quildreen Motta <queen@robotlolita.me>
 *
 * authors:
 *   - Quildreen Motta
 *
 * seeAlso:
 *   - type: entity
 *     path: folktale/core/lambda/compose
 *     reason: The function equivalent of this free-method.
 *
 * signature: fn::compose(nextFn)
 * type: |
 *   (('a) => 'b) . (('b) => 'c) => (('a) => 'c)
 */
module.exports = function _compose(nextFunction) {
  return compose(nextFunction, this);
};
