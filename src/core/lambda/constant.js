//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// See LICENCE for licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

/*~
 * The constant combinator; always returns the first argument given.
 *
 * Constant combinators can be passed to higher-order operations if you
 * want to provide a plain value, but the operation expects a function
 * providing a value:
 *
 *     [1, 2, 3].map(constant(0))
 *     // => [0, 0, 0]
 *
 * In most cases you should consider using an arrow function instead:
 *
 *     [1, 2, 3].map(_ => 0)
 *     // => [0, 0, 0]
 *
 * --------------------------------------------------------------------
 * name        : constant
 * module      : folktale/core/lambda/constant
 * copyright   : (c) 2015-2016 Quildreen Motta, and CONTRIBUTORS
 * licence     : MIT
 * repository  : https://github.com/origamitower/folktale
 *
 * category    : Combining
 * stability   : stable
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
 * signature: constant(value)(_)
 * type: |
 *   ('a) => ('b) => 'a
 */
const constant = (value) => (_) => value;


module.exports = constant;
