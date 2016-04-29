//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// See LICENCE for licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

/*~
 * Applies an unary function to both sides of a binary function.
 *
 * [[on]] is a combinator that's mostly useful for things like sorting,
 * zipping, and other higher-order operations that expect binary
 * operations. It allows one to define a transformation on the arguments
 * in a way that is pretty clear:
 *
 *     let xss = [[1, 2], [3, 1], [-2, 4]];
 *
 *     function compare(a, b) {
 *       return a < b?     -1
 *       :      a === b?    0
 *       :                  1
 *     }
 *
 *     function sortBy(f, xs) {
 *       return xs.slice().sort(f)
 *     }
 *
 *     sortBy(compare::on(first), xs)
 *     // => [[-2, 4], [1, 2], [3, 1]]
 *
 * --------------------------------------------------------------------
 * name        : on
 * module      : folktale/core/lambda/infix/on
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
 * signature: fn::on(transform)(x, y)
 * type: |
 *   (('b, 'b) => 'c) . (('a) => 'b) => (('a, 'a) => 'c)
 */
module.exports = function(transform) {
  return (x, y) => this(transform(x), transform(y));
};
