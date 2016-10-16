//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// See LICENCE for licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

// --[ Dependencies ]---------------------------------------------------
const assertType = require('folktale/helpers/assertType');
const { equals:flEquals } = require('folktale/core/fantasy-land');
const fl = require('folktale/helpers/fantasy-land');
const provideAliases = require('folktale/helpers/provide-fantasy-land-aliases');
const { tagSymbol, typeSymbol } = require('./data');


// --[ Helpers ]--------------------------------------------------------

/*~
 * True if the value conforms to the Setoid interface.
 * 
 * ---
 * type: (Any) => Boolean
 */
const isSetoid = (value) => value != null 
                         && (typeof value[fl.equals] === 'function' || typeof value.equals === 'function');

/*~
 * True if two variant instances are of the same type/tag.
 * 
 * ---
 * type: (Variant, Variant) => Boolean
 */
const sameType = (a, b) => a[typeSymbol] === b[typeSymbol] 
                        && a[tagSymbol] === b[tagSymbol];


// --[ Implementation ]------------------------------------------------
/*~
 * Provides structural equality for ADTs.
 * 
 * The `setoid` derivation bestows Fantasy Land's `fantasy-land/equals`
 * method upon ADTs constructed by Core.ADT, as well as an `equals`
 * alias. This `equals` method performs structural equality, and may
 * be configured on how to compare values that aren't themselves setoids.
 * 
 * 
 * ## Example::
 * 
 *     const { data, setoid } = require('folktale/core/adt');
 *     const Result = data('Result', {
 *       Ok(value){
 *         return { value };
 *       },
 *       Error(value) {
 *         return { value };
 *       }
 *     }).derive(setoid);
 *     const { Ok, Error } = Result;
 * 
 *     Ok(1).equals(Ok(1));
 *     // ==> true
 * 
 *     Ok(1).equals(Error(1));
 *     // ==> false
 * 
 *     Error(Error(1)).equals(Error(Error(1)));
 *     // ==> true
 * 
 * 
 * ## Structural equality
 * 
 * The `equals` method provided by this derivation checks for structural
 * equivalence. That is, two values are considered equal if they have the
 * same content.
 * 
 * For simple ADTs this is pretty easy to see. For example, consider the
 * following definition::
 * 
 *     const { data, setoid } = require('folktale/core/adt');
 *     const Id = data('Id', {
 *       Id(value){ return { value } }
 *     }).derive(setoid);
 * 
 *     const a = Id.Id(1);
 *     const b = Id.Id(1);
 * 
 * Here we have an ADT with a single case, `Id`, and we've made two
 * instances of this data structure, each containing the value `1`.
 * However, if we try to compare them using JavaScript standard
 * operators, we'll not be comparing their contents, but rather whether
 * or not they are the same object::
 * 
 *     a === a; // ==> true
 *     b === b; // ==> true
 *     a === b; // ==> false
 * 
 * So `a === b` is false, even though both `a` and `b` have the same
 * contents. This is because `===` compares values by their identity,
 * and each object has a different identity.
 * 
 * If we want to compare things by value, we can use the `equals` method
 * provided by this setoid derivation instead::
 * 
 *     a.equals(b);        // ==> true
 *     a.equals(a);        // ==> true
 *     a.equals(Id.Id(2)); // ==> false
 * 
 * When comparing with the `equals` method, two values are considered
 * equal if they represent the same value. This is called *structural
 * equality*.
 * 
 * 
 * ## Equality in details
 * 
 * Given two data structures, they are considered equal if:
 * 
 *   - They have the same *type*;
 *   - They have the same *tag*;
 *   - They have the same keys, and these keys have the same values;
 * 
 * The following example shows these in practice::
 * 
 *     const { data, setoid } = require('folktale/core/adt');
 * 
 *     //                    ┌◦ TYPE
 *     //                  ┌╌┴╌╌╌╌┐
 *     const Result = data('Result', {
 *     //  ┌◦ TAG             ┌◦ KEYS
 *     // ┌┴┐               ┌╌┴╌╌╌╌╌┐
 *        Ok(value){ return { value } },
 * 
 *     //   ┌◦ TAG               ┌◦ KEYS
 *     // ┌╌┴╌┐                ┌╌┴╌╌╌╌╌┐
 *        Error(value){ return { value } }
 *     }).derive(setoid);
 * 
 *     const { Ok, Error } = Result;
 * 
 * So here we have the `Result` ADT. Values created from this ADT always
 * have the same type: "Result". A type is expected to be unique within
 * all ADTs in a program::
 * 
 *     Ok(1)[data.typeSymbol];    // ==> 'Result'
 *     Error(1)[data.typeSymbol]; // ==> 'Result'
 * 
 * Each variant has its own tag, which is the name you give to the
 * constructor. A tag is unique within an ADT, but not necessarily unique
 * amongst other ADTs::
 * 
 *     Ok(1)[data.tagSymbol];     // ==> 'Ok'
 *     Error(1)[data.tagSymbol];  // ==> 'Error'
 * 
 * Finally, the keys in an ADT are the same as the keys in the constructor
 * returns. So, in this case, both Ok and Errors have `[value]` as the key::
 * 
 *     Object.keys(Ok(1));    // ==> ['value']
 *     Object.keys(Error(1)); // ==> ['value']
 * 
 * So if we compare these two for equality::
 * 
 *     Ok(1).equals(Ok(1)); // ==> true
 *     // same type, tag, keys and values.
 * 
 *     Ok(1).equals(Ok(2)); // ==> false
 *     // same type, tag, and keys. Different values (1 !== 2).
 * 
 *     Ok(1).equals(Error(1)); // ==> false
 *     // same type, keys, and values. Different tags ('Ok' !== 'Error').
 * 
 *     const { Error: E } = data('Res', {
 *       Error(value){ return { value } }
 *     }).derive(setoid);
 * 
 *     E(1).equals(Error(1)); // ==> false
 *     // same tag, keys, and values. Different types ('Result' !== 'Res')
 * 
 * 
 * ## How complex equality works?
 * 
 * The values in an ADT aren't always a JS primitive, such as numbers and
 * strings. Setoid's `equals` method handles these in two different ways:
 * 
 *   - If the values are a setoid, then the values are compared using the
 *     left Setoid's `equals` method. This means that if all values are
 *     setoids or primitives, then deep equality just works.
 * 
 *   - If the values are not a setoid, the provided equality comparison is
 *     used to compare both values. By default, this comparison just uses
 *     reference equality, so it's the equivalent of `a === b`.
 * 
 * Here's an example::
 * 
 *     const { data, setoid } = require('folktale/core/adt');
 *     const { Id } = data('Id', {
 *       Id(value){ return { value } }
 *     }).derive(setoid);
 * 
 *     // This is fine, because all values are either Setoids or primitives
 *     Id(Id(1)).equals(Id(Id(1))); // ==> true
 * 
 *     // This is not fine, because it compares `[1] === [1]`
 *     Id([1]).equals(Id([1]));     // ==> false
 * 
 * To handle complex JS values, one must provide their own deep equality
 * function. Folktale does not have a deep equality function yet, but
 * most functional libraries have a `equals` function for that.
 * 
 * Here's an example of an equality function that checks array equality::
 * 
 *     const isEqual = (a, b) =>
 *       Array.isArray(a) && Array.isArray(b) ?  arrayEquals(a, b)
 *     : a == null                            ?  a === b
 *     : a['fantasy-land/equals']             ?  a['fantasy-land/equals'](b)
 *     : a.equals                             ?  a.equals(b)
 *     :                                         a === b;
 * 
 *     const arrayEquals = (a, b) =>
 *        Array.isArray(a) && Array.isArray(b)
 *     && a.length === b.length
 *     && a.every((x, i) => isEqual(x, b[i]));
 * 
 *     const { Id: Id2 } = data('Id', {
 *       Id(value){ return { value } }
 *     }).derive(setoid.withEquality(isEqual));
 * 
 *     Id2([1]).equals(Id2([1]));       // ==> true
 *     Id2(Id2(1)).equals(Id2(Id2(1))); // ==> true
 *     Id2(2).equals(Id2(1));           // ==> false
 * 
 * 
 * ## Setoid equality and the asymmetry problem::
 * 
 * Because the Setoid `equals` method is defined directly in objects,
 * and invoked using the method call syntax, it creates an asymmetry
 * problem. That is, if there are two objects, `a` and `b`, then
 * `a equals b` is not the same as `b equals a`, since the `equals`
 * method may be different on those objects!
 * 
 * Here's an example of the asymmetry problem::
 * 
 *     const { data, setoid } = require('folktale/core/adt');
 *     const { Id } = data('Id', {
 *       Id(value){ return { value } }
 *     }).derive(setoid);
 * 
 *     const bogus = {
 *       equals(that){ return that.value === this.value },
 *       value: 1
 *     };
 * 
 *     // This is what you expect
 *     Id(1).equals(bogus); // ==> false
 * 
 *     // And so is this
 *     Id(Id(1)).equals(Id(bogus)); // ==> false
 * 
 *     // But this is not
 *     Id(bogus).equals(Id(Id(1))); // ==> true
 * 
 * To avoid this problem all Setoid implementations should do type
 * checking and make sure that they have the same `equals` method.
 * Setoid implementations derived by this derivation do so by
 * checking the `type` and `tag` of the ADTs being compared.
 * 
 * 
 * ## Performance considerations
 * 
 * There are no optimisations for deep equality provided by this method,
 * thus you should expect it to visit every value starting from the root.
 * This can be quite expensive for larger data structures.
 * 
 * If you expect to be working with larger data structures, and check
 * equality between them often, you are, usually, very out of luck. You
 * may consider providing your own Setoid isntance with the following
 * optimisations:
 * 
 *   - If two objects are the same reference, you don't need to check
 *     them structurally, for they must be equal — Setoid does this,
 *     but if you're providing your own equality function, you must
 *     do this there as well;
 * 
 *   - If two objects have the same type, but different hashes, then
 *     they must have different values (assuming you haven't messed up
 *     your hash function);
 * 
 *   - If two objects have the same type, and the same hashes, then they
 *     *might* be equal, but you can't tell without looking at all of its
 *     values.
 * 
 * 
 * Here's an example of this optimisation applied to linked lists that
 * can only hold numbers (with a very naive hash function)::
 * 
 *     const hash = Symbol('hash code');
 *     const { data, setoid } = require('folktale/core/adt');
 * 
 *     const { Cons, Nil } = data('List', {
 *       Nil(){ return { [hash]: 0 } },
 *       Cons(value, rest) {
 *         return {
 *           [hash]: value + rest[hash],
 *           value, rest
 *         }
 *       }
 *     });
 * 
 *     Nil.prototype.equals = function(that) {
 *       return Nil.hasInstance(that);
 *     }
 * 
 *     Cons.prototype.equals = function(that) {
 *       if (this === that)              return true
 *       if (!Cons.hasInstance(that))    return false
 *       if (this[hash] !== that[hash])  return false
 *       
 *       return this.value === that.value
 *       &&     this.rest.equals(that.rest)
 *     }
 * 
 *     const a = Cons(1, Cons(2, Cons(3, Nil())));
 *     const b = Cons(1, Cons(2, Cons(3, Nil())));
 *     const c = Cons(1, b);
 * 
 *     a.equals(b); // ==> true
 *     a.equals(c); // ==> false
 * 
 * 
 * > **NOTE**:  
 * > You should use a suitable hashing algorithm for your data structures.
 * 
 * 
 * ---
 * category: Derivation
 * stability: experimental
 * authors:
 *   - "@boris-marinov"
 * 
 * type: |
 *   (('a, 'a) => Boolean) => (Variant, ADT) => Void
 */
const createDerivation = (valuesEqual) => {
  /*~
   * Tests if two objects are equal.
   * ---
   * type: ('a, 'a) => Boolean
   */
  const equals = (a, b) => {
    // identical objects must be equal
    if (a === b)  return true;

    // we require both values to be setoids if one of them is
    const leftSetoid  = isSetoid(a);
    const rightSetoid = isSetoid(b);
    if (leftSetoid) {
      if (rightSetoid)  return flEquals(b, a);
      else              return false;
    }

    // fall back to the provided equality
    return valuesEqual(a, b);
  };


  /*~
   * Tests if two variants are equal.
   * ---
   * type: (Object Any, Object Any, Array String) => Boolean
   */
  const compositesEqual = (a, b, keys) => {
    for (let i = 0; i < keys.length; ++i) {
      const keyA = a[keys[i]];
      const keyB = b[keys[i]];
      if (!(equals(keyA, keyB))) {
        return false;
      }
    }
    return true;
  };


  const derivation = (variant, adt) => {
    variant.prototype.equals = function(value) {
      assertType(adt)(`${this[tagSymbol]}#equals`, value);
      return sameType(this, value) && compositesEqual(this, value, Object.keys(this));
    };
    provideAliases(variant.prototype);
    return variant;
  };
  if (process.env.FOLKTALE_DOCS !== 'false') {
    derivation[Symbol.for('@@meta:magical')] = createDerivation[Symbol.for('@@meta:magical')];
    derivation[Symbol.for('@@meta:magical')].type = '(Variant, ADT) => Void';
  }


  return derivation;
};


// --[ Exports ]-------------------------------------------------------
module.exports = createDerivation((a, b) => a === b);
module.exports.withEquality = createDerivation;
