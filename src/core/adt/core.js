//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// See LICENCE for licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

// --[ Dependencies ]---------------------------------------------------
const warnDeprecation = require('folktale/helpers/warnDeprecation');


// --[ Constants and Aliases ]------------------------------------------
const TYPE = Symbol.for('@@folktale:adt:type');
const TAG  = Symbol.for('@@folktale:adt:tag');
const META = Symbol.for('@@meta:magical');

const keys           = Object.keys;
const symbols        = Object.getOwnPropertySymbols;
const defineProperty = Object.defineProperty;
const property       = Object.getOwnPropertyDescriptor;


// --[ Helpers ]--------------------------------------------------------

/*~
 * Returns an array of own enumerable values in an object.
 */
function values(object) {
  return keys(object).map(key => object[key]);
}


/*~
 * Transforms own enumerable key/value pairs.
 */
function mapObject(object, transform) {
  return keys(object).reduce((result, key) => {
    result[key] = transform(key, object[key]);
    return result;
  }, {});
}


/*~
 * Extends an objects with own enumerable key/value pairs from other sources.
 * 
 * This is used to define objects for the ADTs througout this file, and there
 * are some important differences from Object.assign:
 * 
 *   - This code is only concerned with own enumerable property *names*.
 *   - Additionally this code copies all own symbols (important for tags).
 * 
 * When copying, this function copies **whole property descriptors**, which
 * means getters/setters are not executed during the copying. The only
 * exception is when the property name is `prototype`, which is not
 * configurable in functions by default.
 * 
 * This code only special cases `prototype` because any other non-configurable
 * property is considered an error, and should crash the program so it can be
 * fixed.
 */
function extend(target, ...sources) {
  sources.forEach(source => {
    keys(source).forEach(key => {
      if (key === 'prototype') {
        target[key] = source[key];
      } else {
        defineProperty(target, key, property(source, key));
      }
    });
    symbols(source).forEach(symbol => {
      defineProperty(target, symbol, property(source, symbol));
    })
  });
  return target;
}


// --[ Variant implementation ]-----------------------------------------

/*~
 * Defines the variants given a set of patterns and an ADT namespace.
 */
function defineVariants(typeId, patterns, adt) {
  return mapObject(patterns, (name, constructor) => {
    // ---[ Variant Internals ]-----------------------------------------
    function InternalConstructor() { }
    InternalConstructor.prototype = Object.create(adt);

    extend(InternalConstructor.prototype, {
      // This is internal, and we don't want the user to be messing with this.
      [TAG]: name,

      // This is documented by the user, so we don't re-document it.
      constructor: constructor,

      /*~
       * True if a value belongs to the ADT variant.
       * 
       * ---
       * category: Testing and Comparing
       * deprecated:
       *   version: 2.0.0
       *   replacedBy: .hasInstance(value)
       *   reason: |
       *     Having a `value.isFoo` property doesn't allow people to
       *     differentiate two variants from different ADTs that have the
       *     same name. So, instead, now variants and ADTs come with a
       *     static `.hasInstance(value)` method.
       * 
       * ~belongsTo: constructor
       */
      get [`is${name}`]() {
        warnDeprecation(`.is${name} is deprecated. Use ${name}.hasInstance(value)
instead to check if a value belongs to the ADT variant.`);
        return true;
      },

      /*~
       * Selects an operation based on this Variant's tag.
       *
       * The `cata`morphism operation allows a very limited form of
       * pattern matching, by selecting an operation depending on this
       * value's tag.
       *
       * ---
       * category : Transforming
       * type: |
       *   ('a is Variant).({ 'b: (Object Any) => 'c }) => 'c
       *   where 'b = 'a[`@@folktale:adt:tag]
       *
       * deprecated:
       *   version: 2.0.0
       *   replacedBy: .matchWith(pattern)
       *   reason: |
       *     `.cata()` is not a very intuitive name, and most people are
       *     not familiar with the term `catamorphism` either. `.matchWith()`
       *     is more familiar and conveys more information to more people.
       * 
       * ~belongsTo: constructor
       */
      cata(pattern) {
        warnDeprecation('`.cata(pattern)` is deprecated. Use `.matchWith(pattern)` instead.');
        return this.matchWith(pattern);
      },
      
      /*~
       * Selects an operation based on this Variant's tag.
       *
       * The `matchWith` operation allows a very limited form of
       * pattern matching, by selecting an operation depending on this
       * value's tag.
       * 
       * 
       * ## Example::
       * 
       *     const List = data('List', {
       *       Nil:  ()           => ({}),
       *       Cons: (head, tail) => ({ head, tail })
       *     });
       * 
       *     const { Nil, Cons } = List;
       * 
       *     const sum = (list) => list.matchWith({
       *       Nil:  ()               => 0,
       *       Cons: ({ head, tail }) => head + sum(tail)  
       *     });
       * 
       *     sum(Cons(1, Cons(2, Nil()))); // ==> 3
       *
       * ---
       * category : Transforming
       * type: |
       *   ('a is Variant).({ 'b: (Object Any) => 'c }) => 'c
       *   where 'b = 'a[`@@folktale:adt:tag]
       *
       * ~belongsTo: constructor
       */
      matchWith(pattern) {
        return pattern[name](this);
      } 
    });

    function makeInstance(...args) {
      let result = new InternalConstructor();
      Object.assign(result, constructor(...args));
      return result;
    }

    extend(makeInstance, {
      // We propagate the original metadata for the constructor to our
      // wrapper, which is what the user will interact with most of the time.
      [META]: constructor[META],

      /*~
       * The unique tag for this variant within the ADT.
       * 
       * ---
       * category: State and Configuration
       * ~belongsTo: makeInstance
       */
      get tag() {
        return name;
      },

      /*~
       * The (ideally unique) type for the ADT. This is provided by the user
       * creating the ADT, so we can't actually guarantee uniqueness.
       * 
       * ---
       * category: State and Configuration
       * ~belongsTo: makeInstance 
       */
      get type() {
        return typeId;
      },

      /*~
       * The internal constructor provided by the user, which transforms and
       * validates the properties attached to objects constructed in this ADT.
       * 
       * ---
       * category: Internal
       * ~belongsTo: makeInstance 
       */
      get constructor() {
        constructor
      },

      /*~
       * The object that provides common behaviours for instances of this variant.
       * 
       * ---
       * category: Internal
       * ~belongsTo: makeInstance
       */
      prototype: InternalConstructor.prototype,

      /*~
       * Checks if a value belongs to this Variant.
       *
       * This is similar to the `ADT.hasInstance` check, with the
       * exception that we also check if the value is of the same
       * variant (has the same tag) as this variant.
       * 
       * 
       * ## Example::
       * 
       *     const Either = data('Either', {
       *       Left:  (value) => ({ value }),
       *       Right: (value) => ({ value })
       *     });
       * 
       *     const { Left, Right } = Either;
       *  
       *     Left.hasInstance(Left(1));  // ==> true
       *     Left.hasInstance(Right(1)); // ==> false
       *
       * ---
       * category : Comparing and Testing
       * type: |
       *   (Variant) => Boolean
       *
       * ~belongsTo: makeInstance
       */
      hasInstance(value) {
        return !!value && adt.hasInstance(value) && value[TAG] === name;
      },
    });


    return makeInstance;
  });
}



// --[ ADT Implementation ]--------------------------------------------

/*~
 * Constructs a union data structure.
 *
 * ## Using the ADT module::
 *
 *     var List = data('List', {
 *       Nil(){ },
 *       Cons(value, rest) {
 *         return { value, rest };
 *       }
 *     });
 *
 *     var { Nil, Cons } = List;
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
 * hard to model things where the information they represent varies depending on
 * its "type".
 *
 * For correctly modelling something, we usually want to have both records
 * (the composition of independent pieces of data) and unions (a choice between
 * one of many possibilities). This module provides the missing *union type*
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
 *     var List = data('List', {
 *       Nil:  () => {},
 *       Cons: (value, rest) => ({ value, rest })
 *     })
 *
 * That's roughly equivalent to the idiomatic:
 *
 *     var List = {};
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
 *     var Id = data('Identity', { Id: () => {} });
 *     Id[Symbol.for('@@folktale:adt:type')]
 *     // ==> 'Identity'
 *
 * The tag of the value is provided by the global symbol `@@folktale:adt:tag`::
 *
 *     var List = data('List', {
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
 * to a variant. Out of the box the structures constructed by ADT
 * provide a `hasInstance` check that verify if a value is structurally
 * part of an ADT structure, by checking the Type and Tag of that value.
 *
 * ###### checking if a value belongs to an ADT::
 *
 *     var IdA = data('IdA', { Id: (x) => ({ x }) });
 *     var IdB = data('IdB', { Id: (x) => ({ x }) });
 *
 *     IdA.hasInstance(IdA.Id(1))  // ==> true
 *     IdA.hasInstance(IdB.Id(1))  // ==> false
 *
 *
 * ###### checking if a value belongs to a variant::
 *
 *     var Either = data('Either', {
 *       Left:  value => ({ value }),
 *       Right: value => ({ value })
 *     });
 *     var { Left, Right } = Either;
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
 *     var List = data('List', {
 *       Nil:  () => {},
 *       Cons: (value, rest) => ({ value, rest })
 *     });
 *
 *     var { Nil, Cons } = List;
 *
 *     List.sum = function() {
 *       return this.matchWith({
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
 *       var { tag, type } = variant;
 *       variant.prototype.toJSON = function() {
 *         var json = { tag: `${type}:${tag}` };
 *         Object.keys(this).forEach(key => {
 *           var value = this[key];
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
 *     var List = data('List', {
 *       Nil:  () => {},
 *       Cons: (value, rest) => ({ value, rest })
 *     }).derive(ToJSON);
 *
 *     var { Nil, Cons } = List;
 *
 *     Nil().toJSON()
 *     // ==> { tag: "List:Nil" }
 *
 *     Cons(1, Nil()).toJSON()
 *     // ==> { tag: "List:Cons", value: 1, rest: { "tag": "List:Nil" }}
 *
 *
 *
 * ---
 * category    : Data Structures
 * stability   : experimental
 * authors:
 *   - Quildreen Motta
 *
 * seeAlso:
 *   - type  : link
 *     title : "Designing with types: Making illegal states unrepresentable"
 *     url   : http://fsharpforfunandprofit.com/posts/designing-with-types-making-illegal-states-unrepresentable/
 *
 * type: |
 *   (String, Object (Array String)) => ADT
 */
const data = (typeId, patterns) => {
  const ADTNamespace = Object.create(ADT);
  const variants     = defineVariants(typeId, patterns, ADTNamespace);

  extend(ADTNamespace, variants, {
    // This is internal, and we don't really document it to the user
    [TYPE]: typeId,

    /*~
     * The variants present in this ADT.
     * 
     * ---
     * category: Members
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
     * category  : Comparing and Testing
     * type: |
     *   ADT.(Variant) -> Boolean
     *
     * ~belongsTo: ADTNamespace
     */
    hasInstance(value) {
      return !!value && value[TYPE] === this[TYPE];
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
 * ---
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
   * ---
   * category : Extending ADTs
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


// --[ Exports ]--------------------------------------------------------
data.ADT        = ADT;
data.typeSymbol = TYPE;
data.tagSymbol  = TAG;

module.exports = data;
