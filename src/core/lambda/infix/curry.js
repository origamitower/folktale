//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// See LICENCE for licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

const curry = require('../curry');

/*~
 * Transforms functions on tuples into curried functions.
 *
 * This is a wrapper over [[folktale/core/lambda/curry]], which allows
 * one to use curry with the proposed This-Bind syntax:
 *
 *     const add = (x, y) => x + y;
 *     add::curry(2)
 *     // => require('folktale/core/lambda/curry')(2, add)
 *
 * See the original `curry` function for more information.
 *
 * --------------------------------------------------------------------
 * name        : curry
 * module      : folktale/core/lambda/infix/curry
 * copyright   : (c) 2015-2016 Quildreen Motta, and CONTRIBUTORS
 * licence     : MIT
 * repository  : https://github.com/origamitower/folktale
 *
 * category    : Currying
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
 *     path: folktale/core/lambda/curry
 *     reason: The function equivalent of this free-method.
 *
 * signature: fn::curry(arity)
 * type: |
 *   ((Any...) => 'a) . (Number) => 'a or ((Any...) => 'a)
 */
module.exports = function _curry(arity) {
  return curry(arity, this);
};
