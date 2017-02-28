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
const { data, setoid, show, serialize } = require('folktale/core/adt/');
const provideAliases = require('folktale/helpers/provide-fantasy-land-aliases');
const adtMethods = require('folktale/helpers/define-adt-methods');
const extend = require('folktale/helpers/extend');


/*~
 */
const Result = data('folktale:Data.Result', {
  /*~
   * ---
   * category: Constructing
   * stability: experimental
   * type: |
   *   forall a, b: (a) => Result a b
   */
  Error(value) {
    return { value };
  },

  /*~
   * ---
   * category: Constructing
   * stability: experimental
   * type: |
   *   forall a, b: (b) => Result a b
   */
  Ok(value) {
    return { value };
  }
}).derive(setoid, show, serialize);

const { Error, Ok } = Result;

const assertResult = assertType(Result);



extend(Error.prototype, {
  /*~
   * ---
   * isRequired: true
   * category: State and configuration
   * type: |
   *   forall a, b: get (Result a b) => a
   */
  get value() {
    throw new TypeError('`value` can’t be accessed in an abstract instance of Result.Error');
  }
});


extend(Ok.prototype, {
  /*~
   * ---
   * isRequired: true
   * category: State and configuration
   * type: |
   *   forall a, b: get (Result a b) => b
   */
  get value() {
    throw new TypeError('`value` can’t be accessed in an abstract instance of Result.Ok');
  }  
})


/*~
 * ---
 * ~belongsTo: Result
 */
adtMethods(Result, {
  /*~
   * ---
   * category: Transforming
   * stability: experimental
   * signature: map(transformation)
   * type: |
   *   forall a, b, c:
   *     (Result a b).((b) => c) => Result a c
   */
  map: {
    Error(f) {
      assertFunction('Result.Error#map', f);
      return this;
    },

    Ok(f) {
      assertFunction('Result.Ok#map', f);
      return Ok(f(this.value));
    }
  },


  /*~
   * ---
   * category: Transforming
   * stability: experimental
   * signature: apply(anResult)
   * type: |
   *   forall a, b, c:
   *     (Result a ((b) => c)).(Result a b) => Result a c
   */
  apply: {
    Error(anResult) {
      assertResult('Result.Error#apply', anResult);
      return this;
    },

    Ok(anResult) {
      assertResult('Result.Ok#apply', anResult);
      return anResult.map(this.value);
    }
  },


  /*~
   * ---
   * category: Transforming
   * signature: chain(transformation)
   * stability: experimental
   * type: |
   *   forall a, b, c:
   *     (Result a b).((b) => Result a c) => Result a c
   */
  chain: {
    Error(f) {
      assertFunction('Result.Error#chain', f);
      return this;
    },

    Ok(f) {
      assertFunction('Result.Ok#chain', f);
      return f(this.value);
    }
  },

  /*~
   * ---
   * category: Extracting values
   * stability: experimental
   * signature: unsafeGet()
   * type: |
   *   forall a, b: (Result a b).() => b :: throws TypeError
   */
  unsafeGet: {
    Error() {
      throw new TypeError(`Can't extract the value of an Error.

Error does not contain a normal value - it contains an error.
You might consider switching from Result#unsafeGet to Result#getOrElse,
or some other method that is not partial.
      `);
    },

    Ok() {
      return this.value;
    }
  },


  /*~
   * ---
   * category: Extracting values
   * stability: experimental
   * signature: getOrElse(default)
   * type: |
   *   forall a, b: (Result a b).(b) => b
   */
  getOrElse: {
    Error(default_) {
      return default_;
    },

    Ok(default_) {
      return this.value;
    }
  },


  /*~
   * ---
   * category: Recovering
   * stability: experimental
   * signature: orElse(handler)
   * type: |
   *   forall a, b, c:
   *     (Result a b).((a) => Result c b) => Result c b
   */
  orElse: {
    Error(handler) {
      assertFunction('Result.Error#orElse', handler);
      return handler(this.value);
    },

    Ok(handler) {
      assertFunction('Result.Ok#orElse', handler);
      return this;
    }
  },


  /*~
   * ---
   * category: Pattern matching
   * stability: experimental
   * signature: fold(ErrorTransformation, OkTransformation)
   * type: |
   *   forall a, b, c:
   *     (Result a b).((a) => c, (b) => c) => c
   */
  fold: {
    Error(f, g) {
      assertFunction('Result.Error#fold', f);
      assertFunction('Result.Error#fold', g);
      return f(this.value);
    },

    Ok(f, g) {
      assertFunction('Result.Ok#fold', f);
      assertFunction('Result.Ok#fold', g);
      return g(this.value);
    }
  },


  /*~
   * ---
   * category: Transforming
   * stability: experimental
   * signature: swap()
   * type: |
   *   forall a, b: (Result a b).() => Result b a
   */
  swap: {
    Error() {
      return Ok(this.value);
    },

    Ok() {
      return Error(this.value);
    }
  },


  /*~
   * ---
   * category: Transforming
   * stability: experimental
   * signature: bimap(ErrorTransformation, OkTransformation)
   * type: |
   *   (Result a b).((a) => c, (b) => d) => Result c d
   */
  bimap: {
    Error(f, g) {
      assertFunction('Result.Error#bimap', f);
      assertFunction('Result.Error#bimap', g);
      return Error(f(this.value));
    },

    Ok(f, g) {
      assertFunction('Result.Ok#bimap', f);
      assertFunction('Result.Ok#bimap', g);
      return Ok(g(this.value));
    }
  },


  /*~
   * ---
   * category: Transforming
   * stability: experimental
   * signature: mapError(transformation)
   * type: |
   *   forall a, b, c:
   *     (Result a b).((a) => c) => Result c b
   */
  mapError: {
    Error(f) {
      assertFunction('Result.Error#mapError', f);
      return Error(f(this.value));
    },

    Ok(f) {
      assertFunction('Result.Ok#mapError', f);
      return this;
    }
  }
});


Object.assign(Result, {
  /*~
   * ---
   * category: Constructing
   * stability: experimental
   * type: |
   *   forall a, b: (b) => Result a b
   */
  of(value) {
    return Ok(value);
  },

  /*~
   * ---
   * category: Extracting values
   * stability: deprecated
   * type: |
   *   forall a, b: (Result a b).() => b :: (throws TypeError)
   */
  'get'() {
    warnDeprecation('`.get()` is deprecated, and has been renamed to `.unsafeGet()`.');
    return this.unsafeGet();
  },

  /*~
   * ---
   * category: Extracting values
   * stability: experimental
   * type: |
   *   forall a, b: (Result a b).() => a or b
   */
  merge(){
    return this.value;
  },

  /*~
   * ---
   * category: Converting
   * stability: experimental
   * type: |
   *   forall a, b: (Result a b).() => Validation a b
   */
  toValidation() {
    return require('folktale/data/conversions/result-to-validation')(this);
  },


  /*~
   * ---
   * category: Converting
   * stability: experimental
   * type: |
   *   forall a, b: (Result a b).() => Maybe b
   */
  toMaybe() {
    return require('folktale/data/conversions/result-to-maybe')(this);
  }
});


provideAliases(Error.prototype);
provideAliases(Ok.prototype);
provideAliases(Result);

module.exports = Result;
