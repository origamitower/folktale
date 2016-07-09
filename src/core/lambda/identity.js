//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// See LICENCE for licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

/*~
 * The identity combinator; always returns the argument given.
 *
 *
 * ## Example::
 *
 *     identity(1);
 *     // ==> 1
 *
 *     [1, 2, 3].map(identity);
 *     // ==> [1, 2, 3]
 *
 *
 * ## Why?
 *
 * There aren't many reasons to use the `identity` combinator in real
 * JavaScript code. Readability is the only compelling one. Figuring
 * out the concept of `identity` from reading the word `identity` is
 * easier than working your way through its implementation.
 *
 * Compare:
 *
 *     either.bimap(identity, (counter) => counter + 1);
 *
 * With:
 *
 *     either.bimap(
 *       (failure) => failure,
 *       (counter) => counter + 1
 *     )
 *
 *
 * ---
 * category  : Combinators
 * stability : stable
 *
 * authors:
 *   - Quildreen Motta
 *
 * type: |
 *   ('a) => 'a
 */
const identity = (value) => value;


// --[ Exports ]-------------------------------------------------------
module.exports = identity;
