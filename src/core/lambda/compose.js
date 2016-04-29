//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// See LICENCE for licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

/*~
 * Composes two functions.
 *
 * The compose operation allows function composition. In essence, this
 * means that if you have two functions, `inc` and `double`, you can
 * compose them to get a new function having the characteristics of
 * both:
 *
 *     const inc    = (x) => x + 1;
 *     const double = (x) => x * 2;
 *     const incDouble = compose(double, inc);
 *
 *     incDouble(3)
 *     // => double(inc(3))
 *     // => 8
 *
 * > **NOTE**  
 * > Composition is done from right to left, rather than left to right.
 *
 * --------------------------------------------------------------------
 * name        : compose
 * module      : folktale/core/lambda/compose
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
 * signature: compose(f, g)(value)
 * type: |
 *   (('b) => 'c, ('a) => 'b) => (('a) => 'c)
 */
const compose = (f, g) => (value) => f(g(value));


module.exports = compose;
