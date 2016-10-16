//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// See LICENCE for licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

/*~
 * Provides utilities to define tagged unions.
 * 
 * 
 * ## Programming with Tagged Unions
 * 
 * Modelling data is important for a range of reasons. From performance
 * to correctness to safety. Tagged unions give you a way of modelling
 * choices that forces the correct handling of them, unlike predicate-based
 * branching, such as the one used by if statements and other common 
 * control flow structures.
 * 
 * Most of the structures provided by Folktale are tagged unions. But
 * Folktale also gives you a primitive for constructing new ones in an
 * easy way. The `data` function provided by this module achieves that
 * goal::
 * 
 *     const data = require('folktale/core/adt/data');
 *     
 *     const Maybe = data('Maybe', {
 *       Some(value){ return { value } },
 *       None() { return {} }
 *     });
 * 
 *     Maybe.Some(1).matchWith({
 *       Some: ({ value }) => `Found ${value}`,
 *       None: ()          => "Not found" 
 *     });
 *     // ==> "Found 1"
 * 
 * Tagged unions constructed by this module allow one to easily bestow
 * common functionality in them through the `derive` function. For example,
 * one could add the concept of equality to the `Maybe` data structure
 * constructed previously by using the `Setoid` derivation, which is also
 * provided by this module::
 * 
 *     const Setoid = require('folktale/core/adt/setoid');
 *     Maybe.derive(Setoid);
 * 
 *     Maybe.Some(1).equals(Maybe.Some(1)); // ==> true
 *     Maybe.Some(2).equals(Maybe.Some(1)); // ==> false
 * 
 * These structures also provide a way of testing if a value belongs to
 * an ADT in a cross-realm way using the `.hasInstance` method on the ADT
 * or variant::
 * 
 *     Maybe.hasInstance(Maybe.None());       // ==> true
 *     Maybe.Some.hasInstance(Maybe.None());  // ==> false
 *     Maybe.Some.hasInstance(Maybe.Some(1)); // ==> true
 *
 * See the documentation on the `data` function for details.
 * 
 * 
 * ## What's in Core.ADT?
 * 
 * Core.ADT provides features to construct tagged unions, and common
 * derivations for those structures. These operations are divided as
 * follows:
 * 
 *   - **Constructing Data Structures**: functions that construct new
 *   tagged unions.
 * 
 *   - **Extending ADTs**: functions that allow one to extend existing
 *   ADTs and variants with new functionality.
 * 
 *   - **Derivation**: functions that can be used as derivations to
 *   provide common functionality to ADTs.
 * 
 * 
 * ---
 * name        : module folktale/core/adt
 * category    : Data Structures
 */
module.exports = {
  data: require('./data'),
  setoid: require('./setoid'),
  show: require('./show'),
  serialize: require('./serialize')
};
