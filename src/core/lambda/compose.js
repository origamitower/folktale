//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Copyright (C) 2015-2016 Quildreen Motta.
// Licensed under the MIT licence.
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
 * ---
 * name: compose
 * signature: compose(f, g)(value)
 * type: |
 *   forall a, b, c. (b -> c, a -> b) -> (a -> c)
 * category: Combinators
 * tags:
 *   - Lambda Calculus
 * stability: stable
 * platforms:
 *   - ECMAScript
 * authors:
 *   - Quildreen Motta
 * module: folktale/core/lambda/compose
 * licence: MIT
 */
const compose = (f, g) => (value) => f(g(value));


module.exports = compose;
