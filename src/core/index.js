//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// See LICENCE for licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

/*~
 * Provides essential functionality for functional programs.
 * 
 * 
 * ## What's in Core?
 * 
 * This module provides a range of features that are often used as
 * foundational building blocks in functional programming. It also
 * provides features for handling some common built-in JavaScript
 * structures in a functional way.
 * 
 * The operations are divided as follows:
 * 
 *   - **Modelling Data**: The Core.ADT module provides an
 *     implementation of Tagged Unions with limited pattern matching.
 *     This can be used to model your application's data more accurately,
 *     and thus make it harder to misuse that data;
 * 
 *   - **Combining Functions**: The Core.Lambda module provides
 *     operations on functions that allow combining functions together
 *     (like `compose`) or changing how you apply functions (like `curry`
 *     or `partialise`);
 * 
 *   - **Working with Objects as Dictionaries**: The Core.Object module
 *     provides operations that let you treat regular JavaScript objects
 *     as dictionaries. Several JavaScript APIs expect that usage of
 *     objects, but the built-in operations don't support  this well,
 *     so the Core.Object module addresses that.
 * 
 *   - **Writing generic code with Fantasy-Land**: The Core.FantasyLand
 *     module takes care of the differences in the various versions of
 *     the Fantasy Land spec, so you can write generic code that supports
 *     many libraries implementing any version of the spec.
 *
 * ---
 * name        : module folktale/core
 * category    : Essential Operations
 */
module.exports = {
  lambda: require('./lambda'),
  adt: require('./adt'),
  object: require('./object'),
  fantasyLand: require('./fantasy-land')
};
