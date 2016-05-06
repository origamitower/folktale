//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// See LICENCE for licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

// -- CONSTANTS AND ALIASES --------------------------------------------
const TYPE = Symbol.for('@@folktale:adt:type');
const TAG  = Symbol.for('@@folktale:adt:tag');
const keys = Object.keys;


// -- HELPERS ----------------------------------------------------------
function values(object) {
  return keys(object).map(key => object[key]);
}


function mapObject(object, transform) {
  return keys(object).reduce((result, key) => {
    result[key] = transform(key, object[key]);
    return result;
  }, {});
}


function defineVariants(typeId, patterns, adt) {
  return mapObject(patterns, (name, constructor) => {
    function InternalConstructor() { }
    InternalConstructor.prototype = Object.create(adt);

    Object.assign(InternalConstructor.prototype, {
      [`is${name}`]: true,
      [TAG]:         name,
      constructor:   constructor,

      /*~
       * Selects an operation based on this Variant's tag.
       *
       * The `cata`morphism operation allows a very limited form of
       * pattern matching, by selecting an operation depending on this
       * value's tag.
       *
       * ---
       * name      : cata
       * signature : .cata(pattern)
       * stability : experimental
       * category  : Extracting Information
       * type: |
       *   ('a is Variant).({ 'b: (Object Any) => 'c }) => 'c
       *   where 'b = 'a[`@@folktale:adt:tag]
       *
       * ~belongsTo: constructor
       */
      cata(pattern) {
        return pattern[name](this);
      }
    });

    function makeInstance(...args) {
      let result = new InternalConstructor();
      Object.assign(result, constructor(...args));
      return result;
    }

    Object.assign(makeInstance, {
      tag:         name,
      type:        typeId,
      constructor: constructor,
      prototype:   InternalConstructor.prototype,

      /*~
       * Checks if a value belongs to this Variant.
       *
       * This is similar to the ADT.hasInstance check, with the
       * exception that we also check if the value is of the same
       * variant (has the same tag) as this variant.
       *
       * ---
       * name      : hasInstance
       * signature : hasInstance(value)
       * category  : Comparing and Testing
       * type: |
       *   (Variant) => Boolean
       *
       * ~belongsTo: constructor
       */
      hasInstance(value) {
        return adt.hasInstance(value) && value[TAG] === name;
      },
    });


    return makeInstance;
  });
}



// -- IMPLEMENTATION ---------------------------------------------------

/*~
 * Constructs a union data structure.
 *
 * ## Using the ADT module::
 *
 *     const List = data('List', {
 *       Nil(){ },
 *       Cons(value, rest) {
 *         return { value, rest };
 *       }
 *     });
 *
 *     const { Nil, Cons } = List;
 *
 *     Cons('a', Cons('b', Cons('c', Nil())));
 *     // ==> { value: 'a', rest: { value: 'b', ..._ }}
 *
 *
 * ## Why?
 *
 * JavaScript, like most languages, doesn't have a good support for modelling
 * choices as data structures out of the box. In JavaScript, it's easy to model
 * things that are a composition of several independent pieces of data, but it's
 * hard to model things where the information they represent vary depending on
 * its "type".
 *
 * For correctly modelling something, we usually want to have both record
 * (the composition of independent pieces of data) and union (a choice between
 * one of many possibilities) types. This module provides the missing *union type*
 * support for JavaScript.
 *
 *
 * ## Architecture
 *
 * The ADT module approaches this problem in a structural-type-ish way, which
 * happens to be very similar to how OCaml's polymorphic variants work, and
 * how different values are handled in untyped languages.
 *
 * In essence, calling `data` with a set of patterns results in the creation
 * of N constructors, each with a distinct **tag**.
 *
 * Revisiting the previous `List` ADT example, when one writes:
 *
 *     const List = data('List', {
 *       Nil:  () => {},
 *       Cons: (value, rest) => ({ value, rest })
 *     })
 *
 * That's roughly equivalent to the idiomatic:
 *
 *     const List = {};
 *
 *     function Nil() { }
 *     Nil.prototype = Object.create(List);
 *
 *     function Cons(value, rest) {
 *       this.value = value;
 *       this.rest  = rest;
 *     }
 *     Cons.prototype = Object.create(List);
 *
 * The `data` function takes as arguments a type identifier (which can be any
 * object, if you want it to be unique), and an object with the variants. Each
 * property in this object is expected to be a function that returns the
 * properties that'll be provided for the instance of that variant.
 *
 * The given variants are not returned directly. Instead, we return a wrapper
 * that will construct a proper value of this type, and augment it with the
 * properties provided by that variant initialiser.
 *
 *
 * ## Reflection
 *
 * The ADT module relies on JavaScript's built-in reflective features first,
 * and adds a couple of additional fields to this.
 *
 *
 * ### Types and Tags
 *
 * The provided type for the ADT, and the tag provided for the variant
 * are both reified in the ADT structure and the constructed values. These
 * allow checking the compatibility of different values structurally, which
 * sidesteps the problems with realms.
 *
 * The type of the ADT is provided by the global symbol `@@folktale:adt:type`::
 *
 *     const Id = data('Identity', { Id: () => {} });
 *     Id[Symbol.for('@@folktale:adt:type')]
 *     // ==> 'Identity'
 *
 * The tag of the value is provided by the global symbol `@@folktale:adt:tag`::
 *
 *     const List = data('List', {
 *       Nil: () => {},
 *       Cons: (h, t) => ({ h, t })
 *     });
 *     List.Nil()[Symbol.for('@@folktale:adt:tag')]
 *     // ==> 'Nil'
 *
 * These symbols are also exported as properties of the `data` function
 * itself, so you can use `data.typeSymbol` and `data.tagSymbol` instead
 * of retrieving a symbol instance with the `Symbol.for` function.
 *
 *
 * ### `is-a` tests
 *
 * Sometimes it's desirable to test if a value belongs to an ADT or
 * to a variant. Out of the box, the structures constructed by ADT
 * provide a `hasInstance` check that verify if a value is structurally
 * part of an ADT structure, by checking the Type and Tag of that value.
 *
 * ###### checking if a value belongs to an ADT::
 *
 *     const IdA = data('IdA', { Id: (x) => ({ x }) });
 *     const IdB = data('IdB', { Id: (x) => ({ x }) });
 *
 *     IdA.hasInstance(IdA.Id(1))  // ==> true
 *     IdA.hasInstance(IdB.Id(1))  // ==> false
 *
 *
 * ###### checking if a value belongs to a variant::
 *
 *     const Either = data('Either', {
 *       Left:  value => ({ value }),
 *       Right: value => ({ value })
 *     });
 *     const { Left, Right } = Either;
 *
 *     Left.hasInstance(Left(1));  // ==> true
 *     Left.hasInstance(Right(1)); // ==> false
 *
 *
 * Note that if two ADTs have the same type ID, they'll be considered
 * equivalent by `hasInstance`. You may pass an object (like
 * `Symbol('type name')`) to `data` to avoid this, however reference
 * equality does not work across realms in JavaScript.
 *
 * Since all instances inherit from the ADT and the variant's prototype
 * it's also possible to use `proto.isPrototypeOf(instance)` to check
 * if an instance belongs to an ADT by reference equality, rather than
 * structural equality.
 *
 *
 * ## Extending ADTs
 *
 * Because all variants inherit from the ADT namespace, it's possible
 * to provide new functionality to all variants by simply adding new
 * properties to the ADT::
 *
 *     const List = data('List', {
 *       Nil:  () => {},
 *       Cons: (value, rest) => ({ value, rest })
 *     });
 *
 *     const { Nil, Cons } = List;
 *
 *     List.sum = function() {
 *       return this.cata({
 *         Nil:  () => 0,
 *         Cons: ({ value, rest }) => value + rest.sum()
 *       });
 *     };
 *
 *     Cons(1, Cons(2, Nil())).sum();
 *     // ==> 3
 *
 * A better approach, however, may be to use the `derive` function from
 * the ADT to provide new functionality to every variant. `derive` accepts
 * many derivation functions, which are just functions taking a variant and
 * and ADT, and providing new functionality for that variant.
 *
 * If one wanted to define a JSON serialisation for each variant, for example,
 * they could do so by using the `derive` functionality::
 *
 *     function ToJSON(variant, adt) {
 *       const { tag, type } = variant;
 *       variant.prototype.toJSON = function() {
 *         const json = { tag: `${type}:${tag}` };
 *         Object.keys(this).forEach(key => {
 *           const value = this[key];
 *           if (value && typeof value.toJSON === "function") {
 *             json[key] = value.toJSON();
 *           } else {
 *             json[key] = value;
 *           }
 *         });
 *         return json;
 *       }
 *     }
 *
 *     const List = data('List', {
 *       Nil:  () => {},
 *       Cons: (value, rest) => ({ value, rest })
 *     }).derive(ToJSON);
 *
 *     const { Nil, Cons } = List;
 *
 *     Nil().toJSON()
 *     // ==> { tag: "List:Nil" }
 *
 *     Cons(1, Nil()).toJSON()
 *     // ==> { tag: "List:Cons", value: 1, rest: { "tag": "List:Nil" }}
 *
 *
 *
 * ---------------------------------------------------------------------
 * name        : data
 * module      : folktale/core/adt/core
 * copyright   : (c) 2015-2016 Quildreen Motta, and CONTRIBUTORS
 * licence     : MIT
 * repository  : https://github.com/origamitower/folktale
 *
 * category    : Data Structures
 * stability   : experimental
 * portability : portable
 * platforms:
 *   - ECMAScript 2015
 *   - ECMAScript 5, with es6-shim
 *   - ECMAScript 3, with es5-shim and es6-shim
 *
 * maintainers:
 *   - Quildreen Motta <queen@robotlolita.me>
 *
 * authors:
 *   - Quildreen Motta
 *
 * seeAlso:
 *   - type  : link
 *     title : "Designing with types: Making illegal states unrepresentable"
 *     url   : http://fsharpforfunandprofit.com/posts/designing-with-types-making-illegal-states-unrepresentable/
 *
 * signature: data(typeId, patterns)
 * type: |
 *   (String, Object (Array String)) => ADT
 */
const data = (typeId, patterns) => {
  const ADTNamespace = Object.create(ADT);
  const variants     = defineVariants(typeId, patterns, ADTNamespace);

  Object.assign(ADTNamespace, variants, {
    [TYPE]: typeId,

    /*~
     * The variants present in this ADT.
     * ---
     * name: variants
     * type: Array Variant
     * ~belongsTo: ADTNamespace
     */
    variants: values(variants),

    /*~
     * Checks if a value belongs to this ADT.
     *
     * Values are considered to belong to an ADT if they have the same
     * `Symbol.for('@@folktale:adt:type')` property as the ADT's.
     *
     * If you don't want a structural check, you can test whether the
     * ADT is in the prototype chain of the value, but keep in mind that
     * this does not work cross-realm.
     *
     * ---
     * name      : hasInstance
     * category  : Comparing and Testing
     * signature : .hasInstance(value)
     * type: |
     *   ADT.(Variant) -> Boolean
     *
     * ~belongsTo: ADTNamespace
     */
    hasInstance(value) {
      return value[TYPE] === this[TYPE];
    }
  });

  return ADTNamespace;
};


/*~
 * The basis of all algebraic data types.
 *
 * ADT is used basically to share some methods for refining data structures
 * created by this module, derivation being one of them.
 *
 * ---------------------------------------------------------------------
 * name       : ADT
 * category   : Data Structures
 * ~belongsTo : data
 */
const ADT = {

  /*~
   * Allows a function to provide functionality to variants in an ADT.
   *
   * The `derive` method exists to support meta-programming on ADT objects,
   * such that additional functionality (implementation of interfaces or
   * protocols, for example) may be provided by libraries instead of having
   * to be hand-coded by the user.
   *
   * The operation accepts many `derivation` functions, which will be invoked
   * for each variant in the ADT, where a Variant is just an object with the
   * following attributes:
   *
   *     interface Variant(Any...) -> 'a <: self.prototype {
   *       tag         : String,
   *       type        : Any,
   *       constructor : Constructor,
   *       prototype   : Object
   *     }
   *
   * -------------------------------------------------------------------
   * name        : derive
   * category    : Refinement
   * stability   : experimental
   * portability : portable
   * platforms:
   *   - ECMAScript 5
   *   - ECMAScript 3, with es5-shim
   *
   * signature: .derive(...derivation)
   * type: |
   *   ADT . (...(Variant, ADT) => Any) => ADT
   */
  derive(...derivations) {
    derivations.forEach(derivation => {
      this.variants.forEach(variant => derivation(variant, this));
    });
    return this;
  }
};


// -- Exports ----------------------------------------------------------
data.ADT        = ADT;
data.typeSymbol = TYPE;
data.tagSymbol  = TAG;

module.exports = data;
