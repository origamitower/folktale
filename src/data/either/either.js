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
const Either = data('folktale:Data.Either', {
  /*~
   * Constructs an Either containing a Left value.
   * ---
   * category: Constructing
   * stability: experimental
   * type: |
   *   forall a, b: (a) => Either a b
   */
  Left(value)  { return { value } },

  /*~
   * Constructs an Either containing a Right value.
   * ---
   * category: Constructing
   * stability: experimental
   * type: |
   *   forall a, b: (b) => Either a b 
   */
  Right(value) { return { value } }
}).derive(setoid, show, serialize);

const { Left, Right } = Either;

const assertEither = assertType(Either);


/*~
 * ---
 * ~belongsTo: Either
 */
adtMethods(Either, {
  /*~
   * Transforms the `Right` side of an `Either`.
   * 
   * ## Example::
   * 
   *     Left(1).map(x => x + 1);  // ==> Either.Left(1)
   *     Right(1).map(x => x + 1); // ==> Either.Right(2)
   * 
   * ---
   * category: Transforming
   * stability: experimental
   * signature: map(transformation)
   * type: |
   *   forall a, b, c:
   *     (Either a b).((b) => c) => Either a c
   */
  map: {
    Left(f) {
      assertFunction('Either.Left#map', f);
      return this;
    },

    Right(f) {
      assertFunction('Either.Right#map', f);
      return Right(f(this.value));
    }
  },


  /*~
   * Applies a function in an Either to the value of another. Both Eithers
   * must be `Right`.
   * 
   * ## Example::
   * 
   *     const inc = (x) => x + 1;
   * 
   *     Right(inc).apply(Right(1));  // ==> Either.Right(2)
   *     Right(inc).apply(Left(1));   // ==> Either.Left(1)
   *     Left(inc).apply(Left(1));    // ==> Either.Left(inc) 
   * 
   * ---
   * category: Transforming
   * stability: experimental
   * signature: apply(anEither)
   * type: |
   *   forall a, b, c:
   *     (Either a ((b) => c)).(Either a b) => Either a c
   */
  apply: {
    Left(anEither) {
      assertEither('Either.Left#apply', anEither);
      return this;
    },

    Right(anEither) {
      assertEither('Either.Right#apply', anEither);
      return anEither.map(this.value);
    }
  },


  /*~
   * Transform the `Right` side of eithers into another Either.
   * 
   * ## Example::
   * 
   *     Left(1).chain(x => Right(x + 1));  // ==> Either.Left(1)
   *     Right(1).chain(x => Right(x + 1)); // ==> Either.Right(2)
   *     Right(1).chain(x => Left(x + 1));  // ==> Either.Left(2)
   * 
   * ---
   * category: Transforming
   * signature: chain(transformation)
   * stability: experimental
   * type: |
   *   forall a, b, c:
   *     (Either a b).((b) => Either a c) => Either a c
   */
  chain: {
    Left(f) {
      assertFunction('Either.Left#chain', f);
      return this;
    },

    Right(f) {
      assertFunction('Either.Right#chain', f);
      return f(this.value);
    }
  },


  // NOTE:
  // `get` is similar to Comonad's `extract`. The reason we don't implement
  // Comonad here is that `get` is partial, and not defined for Left
  // values.

  /*~
   * Extracts the value of a `Right` either.
   * 
   * Note that this method throws when called with a `Left`. In general
   * it's recommended to use `.getOrElse` instead, where you can provide
   * a failure value.
   * 
   * ## Example::
   * 
   *     Right(1).get();  // ==> 1
   *     
   * ---
   * category: Extracting values
   * stability: experimental
   * signature: get()
   * type: |
   *   forall a, b: (Either a b).() => b :: throws TypeError
   */
  get: {
    Left() {
      throw new TypeError(`Can't extract the value of a Left.

Left does not contain a normal value - it contains an error.
You might consider switching from Either#get to Either#getOrElse, or some other method
that is not partial.
      `);
    },

    Right() {
      return this.value;
    }
  },


  /*~
   * Extracts the value of a `Right` either, or returns a fallback value
   * if given a `Left`.
   * 
   * ## Example::
   * 
   *     Left(1).getOrElse(2);  // ==> 2
   *     Right(1).getOrElse(2); // ==> 1
   * 
   * ---
   * category: Extracting values
   * stability: experimental
   * signature: getOrElse(default)
   * type: |
   *   forall a, b: (Either a b).(b) => b
   */
  getOrElse: {
    Left(default_) {
      return default_;
    },

    Right(default_) {
      return this.value;
    }
  },

  
  /*~
   * Transforms a `Left` either into a new Either.
   * 
   * ## Example::
   * 
   *     Left(1).orElse(x => Right(2));  // ==> Either.Right(2)
   *     Right(1).orElse(x => Right(2)); // ==> Either.Right(1)
   * 
   * ---
   * category: Recovering
   * stability: experimental
   * signature: orElse(handler)
   * type: |
   *   forall a, b, c:
   *     (Either a b).((a) => Either c b) => Either c b
   */
  orElse: {
    Left(handler) {
      assertFunction('Either.Left#orElse', handler);
      return handler(this.value);
    },

    Right(handler) {
      assertFunction('Either.Right#orElse', handler);
      return this;
    }
  },


  /*~
   * Applies a function to each side of an Either.
   * 
   * ## Example::
   * 
   *     const inc = (x) => x + 1;
   *     const dec = (x) => x - 1;
   * 
   *     Left(1).fold(inc, dec);  // ==> inc(1)
   *     Right(1).fold(inc, dec); // ==> dec(1)
   * 
   * ---
   * category: Pattern matching
   * stability: experimental
   * signature: fold(leftTransformation, rightTransformation)
   * type: |
   *   forall a, b, c:
   *     (Either a b).((a) => c, (b) => c) => c
   */
  fold: {
    Left(f, g) {
      assertFunction('Either.Left#fold', f);
      assertFunction('Either.Left#fold', g);
      return f(this.value);
    },

    Right(f, g) {
      assertFunction('Either.Right#fold', f);
      assertFunction('Either.Right#fold', g);
      return g(this.value);
    }
  },


  /*~
   * Returns the value of an Either regardless of its tag.
   * 
   * ## Example::
   * 
   *     Left(1).merge();  // ==> 1
   *     Right(2).merge(); // ==> 2
   * 
   * ---
   * category: Extracting values
   * stability: experimental
   * signature: merge()
   * type: |
   *   forall a, b: (Either a b).() => a or b
   */
  merge: {
    Left() {
      return this.value;
    },

    Right() {
      return this.value;
    }
  },


  /*~
   * Transform Lefts into Rights, and vice-versa.
   * 
   * ## Example::
   * 
   *     Left(1).swap();   // ==> Either.Right(1)
   *     Right(1).swap();  // ==> Either.Left(1)
   * 
   * ---
   * category: Transforming
   * stability: experimental
   * signature: swap()
   * type: |
   *   forall a, b: (Either a b).() => Either b a
   */
  swap: {
    Left() { 
      return Right(this.value); 
    },

    Right() {
      return Left(this.value);
    }
  },


  /*~
   * Transforms each side of an either with a function.
   * 
   * ## Example::
   * 
   *     const inc = (x) => x + 1;
   *     const dec = (x) => x - 1;
   * 
   *     Left(1).bimap(inc, dec);   // ==> Either.Left(inc(1))
   *     Right(1).bimap(inc, dec);  // ==> Either.Right(dec(1))
   * 
   * ---
   * category: Transforming
   * stability: experimental
   * signature: bimap(leftTransformation, rightTransformation)
   * type: |
   *   (Either a b).((a) => c, (b) => d) => Either c d
   */
  bimap: {
    Left(f, g) {
      assertFunction('Either.Left#bimap', f);
      assertFunction('Either.Left#bimap', g);
      return Left(f(this.value));
    },

    Right(f, g) {
      assertFunction('Either.Right#bimap', f);
      assertFunction('Either.Right#bimap', g);
      return Right(g(this.value));
    }
  },


  /*~
   * Transforms the value of Left eithers.
   * 
   * ## Example::
   * 
   *     Left(1).leftMap(x => x + 1);   // ==> Either.Left(2)
   *     Right(1).leftMap(x => x + 1);  // ==> Either.Right(1)
   * 
   * ---
   * category: Transforming
   * stability: experimental
   * signature: leftMap(transformation)
   * type: |
   *   forall a, b, c:
   *     (Either a b).((a) => c) => Either c b
   */
  leftMap: {
    Left(f) {
      assertFunction('Either.Left#leftMap', f);
      return Left(f(this.value));
    },

    Right(f) {
      assertFunction('Either.Right#leftMap', f);
      return this;
    }
  }
});


Object.assign(Either, {
  /*~
   * Constructs an Either holding a Right value.
   * 
   * ## Example::
   * 
   *     Either.of(1);  // ==> Either.Right(1)
   * 
   * ---
   * category: Constructing
   * stability: experimental
   * type: |
   *   forall a, b: (b) => Either a b
   */
  of(value) {
    return Right(value);
  },


  /*~
   * Transforms an Either into a Validation.
   * 
   * ## Example::
   * 
   *     const { Failure, Success } = require('folktale/data/validation');
   * 
   *     Either.Left(1).toValidation();   // ==> Failure(1)
   *     Either.Right(1).toValidation();  // ==> Success(1)
   * 
   * ---
   * category: Converting
   * stability: experimental
   * type: |
   *   forall a, b: (Either a b).() => Validation a b
   */
  toValidation() {
    return require('folktale/data/conversions/either-to-validation')(this);
  },


  /*~
   * Transforms an Either to a Maybe. Left values are lost in the process.
   * 
   * ## Example::
   * 
   *     const { Nothing, Just } = require('folktale/data/maybe');
   * 
   *     Either.Left(1).toMaybe();  // ==> Nothing()
   *     Either.Right(1).toMaybe(); // ==> Just(1)
   * 
   * ---
   * category: Converting
   * stability: experimental
   * type: |
   *   forall a, b: (Either a b).() => Maybe b
   */
  toMaybe() {
    return require('folktale/data/conversions/either-to-maybe')(this);
  }
});


provideAliases(Left.prototype);
provideAliases(Right.prototype);
provideAliases(Either);

module.exports = Either;
