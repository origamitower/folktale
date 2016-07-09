//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// See LICENCE for licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

/*~
 * Core.Lambda provides you tools for transforming and combining
 * functions.
 *
 * 
 * ## Programming by Combining Functions
 * 
 * Functional programming places a heavy emphasis on writing programs
 * by combining lots of small, focused functions. JavaScript doesn't
 * really have a good support for this out of the box, so you're left
 * with composing these functions manually, by defining a new function.
 * 
 * This is not so bad in ECMAScript 2015, thanks to the new arrow
 * function syntax::
 * 
 *     const people = [
 *       { name: 'Alissa' },
 *       { name: 'Max' },
 *       { name: 'Talib' }
 *     ];
 *     people.map(person => person.name);
 *     // ==> ['Alissa', 'Max', 'Talib']
 * 
 * But there are times in which arrow functions don't quite cut it.
 * For example, if one wants to evaluate something eagerly, a constant
 * combinator makes more sense::
 * 
 *     const counter = {
 *       value: 0,
 *       next()  { return ++this.value },
 *       reset() { this.value = 0 }
 *     };
 *     const constant = require('folktale/core/lambda/constant');
 * 
 *     counter.reset();
 *     [0, 0, 0].map(constant(counter.next()));
 *     // ==> [1, 1, 1]
 * 
 *     // Arrows are evaluated lazily, so they don't work for this
 *     counter.reset();
 *     [0, 0, 0].map(_ => counter.next());
 *     // ==> [1, 2, 3]
 * 
 *     // One must store the value somewhere instead
 *     counter.reset();
 *     [0, 0, 0].map((x => _ => x)(counter.next()))
 *
 * 
 * ## What's in Core.Lambda?
 * 
 * Core.Lambda provides combinators and operations that transform the
 * signature of a function. The operations in the module are divided
 * as thus:
 * 
 *   - **Combining**: contains functions that combines functionality
 *   present in different functions into a single function. Composing
 *   functions is an example.
 * 
 *   - **Combinators**: functions that just re-arrange the arguments
 *   they're given. They're convenient ways of writing a particular
 *   operation, but don't have any special behaviour of their own,
 *   nor use anything besides the arguments they're given. Constant
 *   and Identity are common combinators.
 * 
 *   - **Currying and Partialisation**: functions that transform
 *   how parameters are provided to a function. Currying allows a
 *   function to take parameters one at a time, whereas partialisation
 *   allows one to provide some of the positional parameters without
 *   executing the function before the rest is provided.
 * 
 * ---
 * name     : module folktale/core/lambda
 * category : Lambda Calculus
 */
module.exports = {
  identity: require('./identity'),
  constant: require('./constant'),
  curry: require('./curry'),
  compose: require('./compose'),
  partialise: require('./partialise')
};
