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
 *
 * ## Example::
 *
 *     const inc       = (x) => x + 1;
 *     const double    = (x) => x * 2;
 *     const incDouble = compose(double, inc);
 *
 *     incDouble(3);
 *     // ==> 8
 *
 *
 * ## Why Composition Matters?
 *
 * Composition is a way of creating new functionality by combining
 * existing functionality. It helps managing complexity in software
 * projects, since newer functionality can be defined in terms of
 * existing ones, reducing both the amount of code needed to implement
 * newer features, and the amount of time one needs to spend to understand
 * them.
 *
 * This technique is used very often in regular JavaScript code, when
 * we feed the results of a function into another function::
 *
 *     const names = [
 *       'Alissa', 'Max', 'Talib'
 *     ];
 *     const upcase = (name) => name.toUpperCase();
 *
 *     names.map(upcase).join(', ');
 *     // ==> 'ALISSA, MAX, TALIB'
 *
 * Here `names` is fed into the `map` function, which returns an array
 * of the same names in capitals. This new array is then fed into the
 * `join` function, which returns a String where the items are separated
 * by a comma.
 *
 * If we need to use `.map(upcase).join(', ')` in a lot of places, it
 * makes sense to create a new function that captures that composition,
 * so we don't have to type it everywhere::
 *
 *     const showNames = (names) =>
 *       names.map(upcase).join(', ');
 *
 * Now we can use `showNames` instead of `.map(upcase).join(', ')`, and
 * we get the same functionality::
 *
 *     showNames(names);
 *     // ==> 'ALISSA, MAX, TALIB'
 *
 *
 * ## The Problem With Methods in JavaScript
 *
 * JavaScript is a hybrid language, where you can express programs by
 * using object oriented techniques, functional programming techniques,
 * and some other paradigms. It's not uncommon to see parts of a program
 * expressed in OOP, as in the examples from the previous section.
 *
 * However, objects in JavaScript can't be safely extended. Ideally, we'd
 * like to write:
 *
 *     names.show();
 *
 * Instead of:
 *
 *     showNames(names);
 *
 * Which would be more consistent with the rest of the program. Because
 * this involves mutating the array, all sorts of problems could happen
 * so it's better to keep the new functionality as a separate function.
 *
 * Expressing things in functional programming doesn't have this problem
 * because functions exist on their own, rather than being part of an
 * object.
 *
 *
 * ## Composition in Functional Programming
 *
 * In functional programming, functions are the basic building block,
 * and we compose functions to create bigger things. To do this, we often
 * have to rephrase the common method calls in terms of regular functions::
 *
 *     const names = [
 *       'Alissa', 'Max', 'Talib'
 *     ];
 *
 *     const upcase = (name) => name.toUpperCase();
 *     const map    = (transform, items) => items.map(transform);
 *     const join   = (separator, items) => items.join(separator);
 *
 * With this we can express the composition in terms of regular function
 * calls::
 *
 *     const showNames = (names) =>
 *       join(', ', map(upcase, names));
 *
 *     showNames(names);
 *     // ==> 'ALISSA, MAX, TALIB'
 *
 * Now, while the way this program expresses its functions is consistent,
 * we still have to move the whole expression into the function, and
 * our code is not as easy to follow as before. Rather than reading from
 * left to right, we have to first read the inside of a function application
 * before we read what's outside of it.
 *
 * These issues are not a problem with simple expressions such as these,
 * and most of the expressions in functional programming tend to be very
 * simple. But we can improve this by abstracting over the idea of
 * composition. That is, instead of requiring syntactic composition, by
 * having people write out the whole expression, we can ask the program
 * to combine these functions for us. This is what the `compose` function
 * does::
 *
 *     const showNames2 = compose(
 *       capitals => join(', ', capitals),
 *       names    => map(upcase, names)
 *     );
 *
 * Instead of reading from inside of a complex expression to the outside,
 * now you can read each expression on its own, and visualise the flow of
 * data linearly.
 *
 * > **CONVENIENCE**  
 * > `compose` does right-to-left composition, so the last function is
 * > applied first. You can use the `infix` version of compose to avoid
 * > this.
 *
 *
 * ## Currying and Composition
 *
 * Composing unary functions is trivial, as seen on the first example
 * of this documentation::
 *
 *     const inc       = (x) => x + 1;
 *     const double    = (x) => x * 2;
 *     const incDouble = compose(double, inc);
 *
 * But composing functions that take more than one argument doesn't read
 * as naturally::
 *
 *     const upcase = (name) => name.toUpperCase();
 *     const map    = (transform, items) => items.map(transform);
 *     const join   = (separator, items) => items.join(separator);
 *
 *     const showNames = compose(
 *       capitals => join(', ', capitals),
 *       names    => map(upcase, names)
 *     );
 *
 * The problem is that `compose` can only safely compose unary functions,
 * so you have to do some additional work to place the values in the
 * "right places" when your function takes more than one argument.
 *
 * One way to solve this problem is to curry the functions that will be
 * composed. That is, turn a function of arity N, into N functions of
 * arity 1::
 *
 *     const upcase2 = (name) => name.toUpperCase();
 *     const map2    = (transform) => (items) => items.map(transform);
 *     const join2   = (separator) => (items) => items.join(separator);
 *
 *     const showNames2 = compose(join2(', '), map2(upcase2));
 *
 * Note that with a small change to how `map` and `join` are defined, we
 * can make a much better use of the `compose` function. This is not
 * without its drawbacks, however, as now `join` has to be called as
 * `join(',')(names)`.
 *
 * > **CONVENIECE**  
 * > Folktale offers a `curry` function as a convenience for automatically
 * > creating curried versions of existing functions, which also works
 * > around the 1-argument limitation.
 * >
 * > See `folktale/core/lambda/curry` for details.
 *
 * Another way to work around this problem is by using the `partialise`
 * function provided by Folktale. This function creates a new function
 * that specifies only parts of the argument for the original function:
 *
 *     const _ = require('folktale/core/lambda/partialise');
 *
 *     const upcase3 = (name) => name.toUpperCase();
 *     const map3    = (transform, items) => items.map(transform);
 *     const join3   = (separator, items) => items.join(separator);
 *
 *     const showNames3 = compose(
 *       _(join3(', ', _)),
 *       _(map3(upcase, _))
 *     );
 *
 * See `folktale/core/lambda/partialise` for more information on how the
 * `partialise` function works.
 *
 *
 * ## Composing More Than Two Functions
 *
 * The `compose` operation is limited to composing only two functions.
 * This might sound limiting, but it ensures that function composition
 * is well-defined.
 *
 * Because a lot of functions in JavaScript are expected to be variadic,
 * and just ignore the additional parameters, you'd get some very
 * surprising behaviour when trying to pass `compose` to them. For example,
 * the following would throw a type error:
 *
 *     const inc    = (x) => x + 1;
 *     const double = (x) => x * 2;
 *     const square = (x) => x * x;
 *
 *     [inc, double, square].reduce(compose)(3);
 *     // ==> throws TypeError: '1 is not a function'
 *
 * Because it's equivalent to:
 *
 *     const fns = [inc, double, square];
 *     compose(
 *       compose(
 *         square,
 *         double,
 *         1,
 *         fns
 *       ),
 *       inc
 *       0,
 *       fns
 *     )(3);
 *
 *
 * If you need to compose more than two functions, you can use the
 * `infix` syntax, or the `all` convenience function.
 *
 *
 * ### Composition With The Infix Syntax
 *
 * With the [This-Binding syntax][es-bind] proposed for JavaScript, it's
 * possible to compose multiple functions in an, arguably, more natural way:
 *
 *      const then  = compose.infix;
 *      const inc   = (x) => x + 1;
 *      const plus4 = inc::then(inc)::then(inc)::then(inc);
 *
 *      plus4(2);
 *      // ==> 6
 *
 *
 * ### Composition With The `all` Function
 *
 * If you need to compose more than two functions, you might consider using
 * the `all` convenience function instead, which is variadic::
 *
 *     const inc   = (x) => x + 1;
 *     const plus4 = compose.all(inc, inc, inc, inc);
 *
 *     plus4(2);
 *     // ==> 6
 *
 * Composition with the `all` convenience still happens from right to left.
 *
 *
 * [es-bind]: https://github.com/zenparsing/es-function-bind
 *
 * ---
 * category  : Combining
 * stability : stable
 * authors:
 *   - Quildreen Motta
 *
 * signature: compose(f, g)(value)
 * type: |
 *   (('b) => 'c, ('a) => 'b) => (('a) => 'c)
 */
const compose = (f, g) => (value) => f(g(value));


// --[ Convenience ]---------------------------------------------------

/*~
 * Conveniently composes function with the This-Binding syntax.
 *
 * This is a free-method version of `compose` that applies the `this`
 * argument first, then the function it takes as argument. It's meant
 * to be used with the [This-Binding Syntax][es-bind] proposal.
 *
 *     const then   = compose.infix;
 *     const inc    = (x) => x + 1;
 *     const double = (x) => x * 2;
 *
 *     inc::then(double)(2);  // ==> 6
 *
 *
 * [es-bind]: https://github.com/zenparsing/es-function-bind
 *
 * ---
 * category  : Convenience
 * stability : experimental
 * authors:
 *   - Quildreen Motta
 *
 * type: |
 *   (('b) => 'c) . (('a) => 'b) => (('a) => 'c)
 */
compose.infix = function(that) {
  return compose(that, this);
};


/*~
 * Conveniently composes multiple functions.
 *
 * Because `compose` is limited to two functions, composing more than that
 * is awkward::
 *
 *     const inc    = (x) => x + 1;
 *     const double = (x) => x * 2;
 *     const square = (x) => x * x;
 *
 *     const incDoubleSquare = compose(inc, compose(double, square));
 *     incDoubleSquare(3);
 *     // ==> 19
 *
 * In these cases one may use `compose.all`, which is a variadic convenience
 * for composing multiple functions::
 *
 *     const incDoubleSquare2 = compose.all(inc, double, square);
 *     incDoubleSquare2(3);
 *     // ==> 19
 *
 * 
 */
compose.all = function(...fns) {
  if (fns.length < 1) {
    throw new TypeError(`compose.all requires at least one argument, ${arguments.length} given.`);
  }
  return fns.reduce(compose);
};


// --[ Exports ]-------------------------------------------------------
module.exports = compose;
