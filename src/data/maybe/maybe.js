//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

const assertType = require('folktale/helpers/assert-type');
const assertFunction = require('folktale/helpers/assert-function');
const { data, show, setoid, serialize } = require('folktale/core/adt');
const provideAliases = require('folktale/helpers/provide-fantasy-land-aliases');
const warnDeprecation = require('folktale/helpers/warn-deprecation');
const adtMethods = require('folktale/helpers/define-adt-methods');


const Maybe = data('folktale:Data.Maybe', {
  /*~
   * ---
   * category: Constructing
   * type: |
   *   forall a: () => Maybe a
   */
  Nothing() {
  },

  /*~
   * ---
   * category: Constructing
   * type: |
   *   forall a: (a) => Maybe a
   */
  Just(value) {
    return { value };
  }
}).derive(setoid, show, serialize);


const { Nothing, Just } = Maybe;
const assertMaybe = assertType(Maybe);


/*~
 * ---
 * ~belongsTo: Maybe
 */
adtMethods(Maybe, {
  /*~
   * ---
   * category: Transforming
   * signature: map(transformation)
   * type: |
   *   forall a, b: (Maybe a).((a) => b) => Maybe b
   */
  map: {
    /*~
     */
    Nothing(transformation) {
      assertFunction('Maybe.Nothing#map', transformation);
      return this;
    },

    /*~
     */
    Just(transformation) {
      assertFunction('Maybe.Just#map', transformation);
      return Just(transformation(this.value));
    }
  },


  /*~
   * ---
   * category: Transforming
   * signature: apply(aMaybe)
   * type: |
   *   forall a, b: (Maybe (a) => b).(Maybe a) => Maybe b
   */
  apply: {
    /*~
     */
    Nothing(aMaybe) {
      assertMaybe('Maybe.Nothing#apply', aMaybe);
      return this;
    },

    /*~
     */
    Just(aMaybe) {
      assertMaybe('Maybe.Just#apply', aMaybe);
      return aMaybe.map(this.value);
    }
  },


  /*~
   * ---
   * category: Transforming
   * signature: chain(transformation)
   * type: |
   *   forall a, b: (Maybe a).((a) => Maybe b) => Maybe b
   */
  chain: {
    /*~
     */
    Nothing(transformation) {
      assertFunction('Maybe.Nothing#chain', transformation);
      return this;
    },

    /*~
     */
    Just(transformation) {
      assertFunction('Maybe.Just#chain', transformation);
      return transformation(this.value);
    }
  },


  /*~
   * ---
   * category: Extracting values
   * signature: unsafeGet()
   * type: |
   *   forall a: (Maybe a).() => a :: (throws TypeError)
   */
  unsafeGet: {
    /*~
     */
    Nothing() {
      throw new TypeError(`Can't extract the value of a Nothing.

    Since Nothing holds no values, it's not possible to extract one from them.
    You might consider switching from Maybe#get to Maybe#getOrElse, or some other method
    that is not partial.
      `);
    },

    /*~
     */
    Just() {
      return this.value;
    }
  },


  /*~
   * ---
   * category: Extracting values
   * signature: getOrElse(default)
   * type: |
   *   forall a: (Maybe a).(a) => a
   */
  getOrElse: {
    /*~
     */
    Nothing(default_) {
      return default_;
    },

    /*~
     */
    Just(default_) {
      return this.value;
    }
  },


  /*~
   * ---
   * category: Recovering from errors
   * signature: orElse(handler)
   * type: |
   *   forall a: (Maybe a).((a) => Maybe a) => Maybe a
   */
  orElse: {
    /*~
     */
    Nothing(handler) {
      assertFunction('Maybe.Nothing#orElse', handler);
      return handler(this.value);
    },

    /*~
     */
    Just(handler) {
      assertFunction('Maybe.Nothing#orElse', handler);
      return this;
    }
  }
});


Object.assign(Maybe, {
  /*~
   * ---
   * category: Constructing
   * type: |
   *   forall a: (a) => Maybe a
   */
  of(value) {
    return Just(value);
  },


  /*~
   * ---
   * category: Extracting values
   * stability: deprecated
   * type: |
   *   forall a: (Maybe a).() => a :: (throws TypeError)
   */
  'get'() {
    warnDeprecation('`.get()` is deprecated, and has been renamed to `.unsafeGet()`.');
    return this.unsafeGet();
  },


  /*~
   * ---
   * category: Converting to other types
   * type: |
   *   forall a, b: (Maybe a).(b) => Result b a
   */
  toResult(fallbackValue) {
    return require('folktale/data/conversions/maybe-to-result')(this, fallbackValue);  
  },

  /*~
   * ---
   * category: Converting to other types
   * type: |
   *   forall a, b: (Maybe a).(b) => Result b a
   */
  toValidation(fallbackValue) {
    return require('folktale/data/conversions/maybe-to-validation')(this, fallbackValue);
  }
});


provideAliases(Just.prototype);
provideAliases(Nothing.prototype);
provideAliases(Maybe);

module.exports = Maybe;
