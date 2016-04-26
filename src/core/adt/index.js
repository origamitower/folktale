//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// See LICENCE for licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

/*~
 * Constructs a sum data structure.
 *
 * ## Example
 *
 *     const List = data({
 *       Nil: [],
 *       Cons: ['head', 'tail']
 *     });
 *
 *     const { Nil, Cons } = List;
 *     let abc = new Cons({
 *       head: 'a',
 *       tail: new Cons({
 *         head: 'b',
 *         tail: new Cons({
 *           head: 'c',
 *           tail: new Nil()
 *         })
 *       })
 *     });
 *
 *
 * It's recommended to provide wrappers for the constructors:
 *
 *     const cons = (head, tail) => new Cons({ head, tail });
 *     const nil  = _ => new Nil();
 *
 *     let abc = cons('a', cons('b', cons('c', nil())));
 *
 *
 * ## Why?
 *
 * JavaScript, as most languages, only really supports product types
 * out of the box. This means that we can easily model data structures that
 * are a composition of several independent pieces of data, however it also
 * means that as soon as we need to model a different kind of data structure,
 * like one where the fields vary depending on its type, we're on our own.
 *
 * For correctly modelling something, we usually want to have both product
 * (the composition of independent pieces of data) and sum (a choice between
 * one of many possibilities) types. This module provides the missing *sum*
 * support for JavaScript.
 *
 *
 * ## Architecture
 *
 * In most cases, one would ideally want a closed sum (that is, once you
 * construct an ADT, there's no way of changing the variants that are part
 * of it). JavaScript is an untyped language, however, so that doesn't make
 * much of a sense to begin with.
 *
 * Because of this, the ADT module approaches the problem in a structural-type-ish
 * way, which happens to be very similar to how different values are handled in
 * unityped languages to begin with. In essence, calling `data` with a set
 * of patterns results in the creation of N constructors, each with a distinct
 * **tag**. The constructors accept an object as their only argument, and will
 * extract the fields that are relevant to that variant to initialise its state.
 *
 * Revisiting the previous `List` ADT example, we can see this by just looking
 * at its return value:
 *
 *     const List = data({
 *       Nil: [],
 *       Cons: ['head', 'tail']
 *     });
 *
 * Would expand to:
 *
 *     const List = Object.create(ADT);
 *
 *     List.Nil = function() { };
 *     List.Nil.prototype = Object.create(List);
 *     List.Nil.prototype.tag = 'Nil';
 *     List.Nil.prototype.fields = [];
 *
 *     List.Cons = function(data) {
 *       this.head = data.head;
 *       this.tail = data.tail;
 *     }
 *     List.Cons.prototype = Object.create(List);
 *     List.Cons.prototype.tag = 'Cons';
 *     List.Cons.prototype.fields = ['head', 'tail'];
 *
 * Furthermore, each variant gets a `cata` method for free. This method
 * implements a kind of structural transformation (*catamorphism*) that
 * is similar to a limited form of pattern matching:
 *
 *     const list = new Cons({ head: 1, tail: new Nil() });
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
 *     head(new Nil());
 *     // => 'Nils have no head'
 *
 *     head(new Cons({ head: 1, tail: new Nil() }));
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
 *     const b = new ListB.Nil();
 *
 *     ListA.isPrototypeOf(b);
 *     // => false
 *
 *     ListB.isPrototypeOf(b);
 *     // => true
 *
 * ---------------------------------------------------------------------
 * name        : data
 * module      : folktale/core/adt
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
 *     title : Designing with types: Making illegal states unrepresentable
 *     url   : http://fsharpforfunandprofit.com/posts/designing-with-types-making-illegal-states-unrepresentable/
 *
 * signature: data(patterns)
 * type: |
 *   (Object (Array String)) => ADT
 */
const data = (patterns) => {
  const ADT_Namespace = Object.create(ADT);
  const variants      = defineVariants(patterns, ADT_Namespace);

  Object.assign(ADT_Namespace, variants);

  return ADT_Namespace;
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
 * @belongsTo : data
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
   *     interface Variant {
   *       name        : String,
   *       constructor : Constructor,
   *       prototype   : Object,
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
   *     new List.Nil().toJSON()
   *     // => { tag: 'Nil' }
   *
   *     new List.Cons({ head: 1, tail: new List.Nil() })
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


// -- Helpers -----------------------------------------------------------------

// Maps values in objects
const mapObject = (object, transform) =>
        Object.keys(object).reduce((result, key) => {
          result[key] = transform(key, object[key]);
          return result;
        }, {});


// Constructs variants given an object with the variant patterns.
//
// A pattern is an object in the form of `{ String -> [String] }`,
// and this function returns an object of the form:
//
//     interface Variant {
//       name: string,
//       constructor: Constructor,
//       prototype: Object,
//       fields: [String]
//     }
//
// All constructors inherit from the `namespace` constructor's
// prototype.
//
// Each Variant includes a few reflective methods, and a pattern
// matching/catamorphism method.
const defineVariants = (patterns, namespace) => {
  return mapObject(patterns, (name, fields) => {
    function ADT_Variant(data) {
      for (var i = 0; i < fields.length; ++i) {
        var key = fields[i];
        this[key] = data[key];
      }
    };
    ADT_Variant.prototype = Object.create(namespace);
    Object.assign(ADT_Variant.prototype, {
      ['is' + name]: true,
      tag: name,
      fields: fields,
      cata(pattern) {
        return pattern[name](this);
      }
    });

    return {
      name: name,
      constructor: ADT_Variant,
      prototype: ADT_Variant.prototype,
      fields: fields
    };
  });
};
