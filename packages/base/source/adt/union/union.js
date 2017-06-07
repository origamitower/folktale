//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

// --[ Dependencies ]---------------------------------------------------
const warnDeprecation = require('folktale/helpers/warn-deprecation');
const extend = require('folktale/helpers/extend');


// --[ Constants and Aliases ]------------------------------------------
const TYPE = Symbol.for('@@folktale:adt:type');
const TAG  = Symbol.for('@@folktale:adt:tag');
const META = Symbol.for('@@meta:magical');

const keys = Object.keys;


// --[ Helpers ]--------------------------------------------------------

//
// Returns an array of own enumerable values in an object.
//
function values(object) {
  return keys(object).map(key => object[key]);
}


//
// Transforms own enumerable key/value pairs.
//
function mapObject(object, transform) {
  return keys(object).reduce((result, key) => {
    result[key] = transform(key, object[key]);
    return result;
  }, {});
}


// --[ Variant implementation ]-----------------------------------------

//
// Defines the variants given a set of patterns and an ADT namespace.
//
function defineVariants(typeId, patterns, adt) {
  return mapObject(patterns, (name, constructor) => {
    // ---[ Variant Internals ]-----------------------------------------
    function InternalConstructor() { }
    InternalConstructor.prototype = Object.create(adt);

    extend(InternalConstructor.prototype, {
      // This is internal, and we don't want the user to be messing with this.
      [TAG]: name,

      /*~ ~inheritsMeta: constructor */
      get constructor() {
        return constructor;
      },

      /*~
       * ~belongsTo: constructor
       * module: null
       * deprecated:
       *   version: 2.0.0
       *   replacedBy: .hasInstance(value)w
       */
      get [`is${name}`]() {
        warnDeprecation(`.is${name} is deprecated. Use ${name}.hasInstance(value)
instead to check if a value belongs to the ADT variant.`);
        return true;
      },
      
      /*~
       * ~belongsTo: constructor
       * module: null
       * type: |
       *   ('a is Variant).({ 'b: (Object Any) => 'c }) => 'c
       *   where 'b = 'a[`@@folktale:adt:tag]
       */
      matchWith(pattern) {
        return pattern[name](this);
      } 
    });

    function makeInstance(...args) {
      let result = new InternalConstructor();         // eslint-disable-line prefer-const
      extend(result, constructor(...args) || {});
      return result;
    }

    extend(makeInstance, {
      // We propagate the original metadata for the constructor to our
      // wrapper, which is what the user will interact with most of the time.
      [META]: constructor[META],

      /*~ 
       * ~belongsTo: makeInstance 
       * module: null
       */
      get tag() {
        return name;
      },

      /*~ 
       * ~belongsTo: makeInstance 
       * module: null
       */
      get type() {
        return typeId;
      },

      /*~ 
       * ~belongsTo: makeInstance 
       * module: null
       */
      get constructor() {
        return constructor;
      },

      /*~ ~belongsTo: makeInstance */
      prototype: InternalConstructor.prototype,

      /*~
       * ~belongsTo: makeInstance
       * module: null
       * type: |
       *   (Variant) => Boolean
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
 * authors:
 *   - Quildreen Motta
 * 
 * stability: experimental
 * type: |
 *   (String, Object (Array String)) => Union
 */
const union = (typeId, patterns) => {
  const UnionNamespace = Object.create(Union);
  const variants       = defineVariants(typeId, patterns, UnionNamespace);

  extend(UnionNamespace, variants, {
    // This is internal, and we don't really document it to the user
    [TYPE]: typeId,

    /*~
     * type: Array Variant
     * module: null
     * ~belongsTo: UnionNamespace
     */
    variants: values(variants),

    /*~
     * ~belongsTo: UnionNamespace
     * module: null
     * type: |
     *   Union.(Variant) -> Boolean
     */
    hasInstance(value) {
      return Boolean(value)
      &&     value[TYPE] === this[TYPE];
    }
  });

  return UnionNamespace;
};


/*~ ~belongsTo : union */
const Union = {
  /*~
   * type: |
   *   Union . (...(Variant, Union) => Any) => Union
   */
  derive(...derivations) {
    derivations.forEach(derivation => {
      this.variants.forEach(variant => derivation(variant, this));
    });
    return this;
  }
};


// --[ Exports ]--------------------------------------------------------
union.Union      = Union;
union.typeSymbol = TYPE;
union.tagSymbol  = TAG;

module.exports = union;
