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
 * ---
 * name: constant
 * signature: constant(value)(_)
 * type: forall a, b. a -> b -> a
 * category: Combinators
 * tags:
 *   - Lambda Calculus
 * stability: stable
 * platforms:
 *   - ECMAScript
 * authors:
 *   - Quildreen Motta
 * module: folktale/core/lambda/constant
 * licence: MIT
 */
const constant = (value) => (_) => value;


module.exports = constant;
