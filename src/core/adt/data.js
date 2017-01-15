//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
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
    });
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
        return constructor;
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
        return Boolean(value) 
        &&     adt.hasInstance(value) 
        &&     value[TAG] === name;
      },
    });


    return makeInstance;
  });
}



// --[ ADT Implementation ]--------------------------------------------

/*~
 * ---
 * category    : Constructing Data Structures
 * stability   : experimental
 * authors:
 *   - Quildreen Motta
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
      return Boolean(value)
      &&     value[TYPE] === this[TYPE];
    }
  });

  return ADTNamespace;
};


/*~
 * ---
 * category   : Data Structures
 * ~belongsTo : data
 */
const ADT = {
  /*~
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
