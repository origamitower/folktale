//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// See LICENCE for licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

/*~
 * Essential functional combinators and higher-order functions derived
 * from λ-calculus.
 *
 * ## Why?
 *
 * Functional programming places heavy emphasis in composition (especially
 * function composition), but JavaScript lacks most of the built-in
 * functionality for composing and transforming functions in a simple way.
 * The `folktale.core.lambda` module fills this gap by providing tools
 * for composing functions, changing the shape of a function in order
 * to compose them in different ways, and providing currying/uncurrying
 * support.
 *
 * --------------------------------------------------------------------
 * name       : module folktale/core/lambda
 * module     : folktale/core/lambda
 * copyright  : (c) 2015-2016 Quildreen Motta, and CONTRIBUTORS
 * licence    : MIT
 * repository : https://github.com/origamitower/folktale
 *
 * category   : Lambda Calculus
 *
 * maintainers:
 *   - Quildreen Motta <queen@robotlolita.me>
 */
module.exports = {
  identity: require('./identity'),
  constant: require('./constant'),
  curry: require('./curry'),
  compose: require('./compose'),
  infix: require('./infix')
};
