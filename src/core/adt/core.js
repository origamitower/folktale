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


function defineVariants(patterns, namespace) {
  return mapObject(patterns, (name, constructor) => {
    function InternalConstructor() { }
    InternalConstructor.prototype = Object.create(namespace);

    Object.assign(InternalConstructor.prototype, {
      [`is${name}`]: true,
      TAG:           name,
      constructor:   constructor,

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
        return namespace.hasInstance(value) && value[TAG] === name;
      },

      /*~
       * Dispatches based on this variant's tag.
       *
       * Selects an operation based on this variant's tag. This is
       * similar to a very limited form of pattern matching.
       *
       * ---
       * name      : cata
       * signature : .cata(pattern)
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
      constructor: constructor,
      prototype:   InternalConstructor.prototype
    });


    return makeInstance;
  });
}



// -- IMPLEMENTATION ---------------------------------------------------


/*~
 * Constructs a sum data structure.
 *
 * ## Example
 *
 *     const List = data('List', {
 *       Nil(){ },
 *       Cons(head, tail) { return { head, tail } }
 *     });
 *
 *     const { Nil, Cons } = List;
 *
 *     let abc = Cons('a', Cons('b', Cons('c', Nil())));
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
 * In most cases, one would ideally want a closed union type (that is, once you
 * construct an ADT, there's no way of changing the variants that are part
 * of it). JavaScript is an untyped language, however, so that doesn't make
 * much of a sense to begin with.
 *
 * Because of this, the ADT module approaches the problem in a structural-type-ish
 * way, which happens to be very similar to how different values are handled in
 * unityped languages. In essence, calling `data` with a set of patterns results
 * in the creation of N constructors, each with a distinct **tag**.
 *
 * Revisiting the previous `List` ADT example, we can see this by just looking
 * at its return value:
 *
 *     const List = data('List', {
 *       Nil: [],
 *       Cons: ['head', 'tail']
 *     });
 *
 * Would expand to:
 *
 *     const List = Object.create(ADT);
 *     List.type = 'List';
 *
 *     List.Nil = function Nil() {
 *       if (!(this instanceof Nil))  return new Nil();
 *     };
 *     List.Nil.prototype = Object.create(List);
 *     List.Nil.prototype.tag = 'Nil';
 *     List.Nil.prototype.fields = [];
 *
 *     List.Cons = function Cons(head, tail) {
 *       if (!(this instanceof Cons))  return new Cons(head, tail);
 *
 *       this.head = head;
 *       this.tail = tail;
 *     }
 *     List.Cons.prototype = Object.create(List);
 *     List.Cons.prototype.tag = 'Cons';
 *     List.Cons.prototype.fields = ['head', 'tail'];
 *
 * Furthermore, each variant gets a `cata` method for free. This method
 * implements a kind of structural transformation (*catamorphism*) that
 * is similar to a limited form of pattern matching:
 *
 *     const list = Cons(1, Nil())
 *
 *     const sum = (list) =>
 *       list.cata({
 *         Nil : _                => 0,
 *         Cons: ({ head, tail }) => head + sum(tail)
 *       });
 *
 *
 * ## Reflection and extension
 *
 * Structures created by the ADT module are reflective, so one can use the
 * exposed information for meta-programming at runtime. One of the uses for
 * this is providing a particular set of behaviours automatically for the
 * structure — a process we call “derivation”. Things like `equality` or
 * `serialisation` become pretty simple to do automatically, and relieve
 * the burden on the user.
 *
 * Each ADT comes with a [[derive]] method, which will take one or more
 * derivation functions and apply them to each variant in the structure.
 * This makes it easy to implement derivations that work across all of
 * the variants at once.
 *
 * Another approach is to attach methods to the ADT namespace itself, since
 * all variants inherit from it. If you were to implement something like
 * the `cata` operation, for example, you could do so as follows:
 *
 *     const List = data({
 *       Nil: [],
 *       Cons: ['head', 'tail']
 *     });
 *
 *     List.match = function(pattern) {
 *       pattern[this.tag](this)
 *     }
 *
 *     const head = (list) => list.match({
 *       Nil : _          => 'Nils have no head',
 *       Cons: ({ head }) => head
 *     });
 *
 *     head(Nil());
 *     // => 'Nils have no head'
 *
 *     head(Cons(1, Nil()));
 *     // => 1
 *
 *
 * ## Membership testing
 *
 * Most of the time, it's a good idea to use structural equivalence and
 * the `catamorphism` operation to deal with transformations on ADT
 * structures. The dynamic dispatch in JavaScript will make sure that
 * the right operations are invoked for you, with no work necessary
 * in your part, and you don't risk any problems with Realms and other
 * concepts that might give you different instances of the same object.
 *
 * Sometimes, however, it might be desirable to test if a variant
 * belongs to a particular tagged union. ADT itself doesn't provide
 * any method for this, but since variants inherit from the ADT
 * namespace, you can use JavaScript's native `.isPrototypeOf`
 * operation to test for this:
 *
 *     const ListA = data({
 *       Nil: [],
 *       Cons: ['head', 'tail']
 *     });
 *
 *     const ListB = data({
 *       Nil: [],
 *       Cons: ['head', 'tail']
 *     });
 *
 *     const b = ListB.Nil();
 *
 *     ListA.isPrototypeOf(b);
 *     // => false
 *
 *     ListB.isPrototypeOf(b);
 *     // => true
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
  const variants     = defineVariants(patterns, ADTNamespace);

  Object.assign(ADTNamespace, variants, {
    [TYPE]: typeId,
    type:   typeId,

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
   *       constructor : Constructor,
   *       prototype   : Object
   *       fields      : [String]
   *     }
   *
   * A derivation function can then use this information to include new
   * operations on the variant. For example, a JSON derivation could be
   * implemented as follows:
   *
   *     const ToJSON = (variant, adt) => {
   *       const fields = variant.fields;
   *       const tag = variant.name;
   *       variant['toJSON'] = function() {
   *         const json = { tag: tag };
   *         fields.forEach(k => json[k] = this[k]);
   *         return json;
   *       }
   *     }
   *
   * And used as such:
   *
   *     const List = data({
   *       Nil: [],
   *       Cons: ['head', 'tail']
   *     }).derive(ToJSON);
   *
   *     List.Nil().toJSON()
   *     // => { tag: 'Nil' }
   *
   *     List.Cons(1, List.Nile())
   *     // => { tag: 'Cons', head: 1, tail: { tag: 'Nil' }}
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
data.ADT = ADT;
module.exports = data;