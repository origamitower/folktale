//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

const assertType = require('folktale/helpers/assertType');
const assertFunction = require('folktale/helpers/assertFunction');
const { data, setoid, show, serialize } = require('folktale/core/adt/');
const provideAliases = require('folktale/helpers/provide-fantasy-land-aliases');
const adtMethods = require('folktale/helpers/define-adt-methods');


/*~
 * A data structure that models a disjunction, commonly used for modelling
 * failures with an error object.
 * ---
 * category: Data structures
 * stability: experimental
 * authors:
 *   - "@boris-marinov"
 */
const Result = data('folktale:Data.Result', {
  /*~
   * Constructs an Result containing a Error value.
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
   * Constructs an Result containing a Ok value.
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


/*~
 * ---
 * ~belongsTo: Result
 */
adtMethods(Result, {
  /*~
   * Transforms the `Ok` side of an `Result`.
   * 
   * ## Example::
   * 
   *     Error(1).map(x => x + 1);  // ==> Result.Error(1)
   *     Ok(1).map(x => x + 1); // ==> Result.Ok(2)
   * 
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
   * Applies a function in an Result to the value of another. Both Results
   * must be `Ok`.
   * 
   * ## Example::
   * 
   *     const inc = (x) => x + 1;
   * 
   *     Ok(inc).apply(Ok(1));  // ==> Result.Ok(2)
   *     Ok(inc).apply(Error(1));   // ==> Result.Error(1)
   *     Error(inc).apply(Error(1));    // ==> Result.Error(inc) 
   * 
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
   * Transform the `Ok` side of Results into another Result.
   * 
   * ## Example::
   * 
   *     Error(1).chain(x => Ok(x + 1));  // ==> Result.Error(1)
   *     Ok(1).chain(x => Ok(x + 1)); // ==> Result.Ok(2)
   *     Ok(1).chain(x => Error(x + 1));  // ==> Result.Error(2)
   * 
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


  // NOTE:
  // `get` is similar to Comonad's `extract`. The reason we don't implement
  // Comonad here is that `get` is partial, and not defined for Error
  // values.

  /*~
   * Extracts the value of a `Ok` Result.
   * 
   * Note that this method throws when called with a `Error`. In general
   * it's recommended to use `.getOrElse` instead, where you can provide
   * a failure value.
   * 
   * ## Example::
   * 
   *     Ok(1).get();  // ==> 1
   *     
   * ---
   * category: Extracting values
   * stability: experimental
   * signature: get()
   * type: |
   *   forall a, b: (Result a b).() => b :: throws TypeError
   */
  get: {
    Error() {
      throw new TypeError(`Can't extract the value of a Error.

Error does not contain a normal value - it contains an error.
You might consider switching from Result#get to Result#getOrElse, or some other method
that is not partial.
      `);
    },

    Ok() {
      return this.value;
    }
  },


  /*~
   * Extracts the value of a `Ok` Result, or returns a fallback value
   * if given a `Error`.
   * 
   * ## Example::
   * 
   *     Error(1).getOrElse(2);  // ==> 2
   *     Ok(1).getOrElse(2); // ==> 1
   * 
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
   * Transforms a `Error` Result into a new Result.
   * 
   * ## Example::
   * 
   *     Error(1).orElse(x => Ok(2));  // ==> Result.Ok(2)
   *     Ok(1).orElse(x => Ok(2)); // ==> Result.Ok(1)
   * 
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
   * Applies a function to each side of an Result.
   * 
   * ## Example::
   * 
   *     const inc = (x) => x + 1;
   *     const dec = (x) => x - 1;
   * 
   *     Error(1).fold(inc, dec);  // ==> inc(1)
   *     Ok(1).fold(inc, dec); // ==> dec(1)
   * 
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
   * Returns the value of an Result regardless of its tag.
   * 
   * ## Example::
   * 
   *     Error(1).merge();  // ==> 1
   *     Ok(2).merge(); // ==> 2
   * 
   * ---
   * category: Extracting values
   * stability: experimental
   * signature: merge()
   * type: |
   *   forall a, b: (Result a b).() => a or b
   */
  merge: {
    Error() {
      return this.value;
    },

    Ok() {
      return this.value;
    }
  },


  /*~
   * Transform Errors into Oks, and vice-versa.
   * 
   * ## Example::
   * 
   *     Error(1).swap();   // ==> Result.Ok(1)
   *     Ok(1).swap();  // ==> Result.Error(1)
   * 
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
   * Transforms each side of an Result with a function.
   * 
   * ## Example::
   * 
   *     const inc = (x) => x + 1;
   *     const dec = (x) => x - 1;
   * 
   *     Error(1).bimap(inc, dec);   // ==> Result.Error(inc(1))
   *     Ok(1).bimap(inc, dec);  // ==> Result.Ok(dec(1))
   * 
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
   * Transforms the value of Error Results.
   * 
   * ## Example::
   * 
   *     Error(1).errorMap(x => x + 1);   // ==> Result.Error(2)
   *     Ok(1).errorMap(x => x + 1);  // ==> Result.Ok(1)
   * 
   * ---
   * category: Transforming
   * stability: experimental
   * signature: errorMap(transformation)
   * type: |
   *   forall a, b, c:
   *     (Result a b).((a) => c) => Result c b
   */
  errorMap: {
    Error(f) {
      assertFunction('Result.Error#errorMap', f);
      return Error(f(this.value));
    },

    Ok(f) {
      assertFunction('Result.Ok#errorMap', f);
      return this;
    }
  }
});


Object.assign(Result, {
  /*~
   * Constructs an Result holding a Ok value.
   * 
   * ## Example::
   * 
   *     Result.of(1);  // ==> Result.Ok(1)
   * 
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
   * Transforms an Result into a Validation.
   * 
   * ## Example::
   * 
   *     const { Failure, Success } = require('folktale/data/validation');
   * 
   *     Result.Error(1).toValidation();   // ==> Failure(1)
   *     Result.Ok(1).toValidation();  // ==> Success(1)
   * 
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
   * Transforms an Result to a Maybe. Error values are lost in the process.
   * 
   * ## Example::
   * 
   *     const { Nothing, Just } = require('folktale/data/maybe');
   * 
   *     Result.Error(1).toMaybe();  // ==> Nothing()
   *     Result.Ok(1).toMaybe(); // ==> Just(1)
   * 
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
