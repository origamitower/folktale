const assertType = require('folktale/helpers/assertType');
const assertFunction = require('folktale/helpers/assertFunction');
const { data, setoid, show, serialize } = require('folktale/core/adt/');
const provideAliases = require('folktale/helpers/provide-fantasy-land-aliases');


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

// -- Functor ----------------------------------------------------------
/*~
 * Transforms the successful contents of an Either.
 * ---
 * category: Transforming
 * stability: experimental
 * type: |
 *   forall a, b, c:
 *     (Either a b).((b) => c) => Either a c
 */
Left.prototype.map = function(transformation) {
  assertFunction('Either.Left#map', transformation);
  return this;
};

/*~
 * Transforms the successful contents of an Either.
 * ---
 * category: Transforming
 * stability: experimental
 * type: |
 *   forall a, b, c:
 *     (Either a b).((b) => c) => Either a c
 */
Right.prototype.map = function(transformation) {
  assertFunction('Either.Right#map', transformation);
  return Right(transformation(this.value));
};

// -- Apply ------------------------------------------------------------
/*~
 * Applies the successful function of an Either to the value of another.
 * ---
 * category: Transforming
 * stability: experimental
 * type: |
 *   forall a, b, c:
 *     (Either a (b) => c).(Either a b) => Either a c  
 */
Left.prototype.apply = function(anEither) {
  assertEither('Left#apply', anEither);
  return this;
};

/*~
 * Applies the successful function of an Either to the value of another.
 * ---
 * category: Transforming
 * stability: experimental
 * type: |
 *   forall a, b, c:
 *     (Either a (b) => c).(Either a b) => Either a c  
 */
Right.prototype.apply = function(anEither) {
  assertEither('Right#apply', anEither);
  return anEither.map(this.value);
};


// -- Applicative ------------------------------------------------------
/*~
 * Constructs an Either holding a succesful value.
 * ---
 * category: Constructing
 * stability: experimental
 * type: |
 *   forall a, b: (b) => Either a b
 */
Either.of = Right;

// -- Chain ------------------------------------------------------------
/*~
 * Transforms successful Eithers.
 * ---
 * category: Transforming
 * stability: experimental
 * type: |
 *   forall a, b, c:
 *     (Either a b).((b) => Either a c) => Either a c
 */
Left.prototype.chain = function(transformation) {
  assertFunction('Either.Left#chain', transformation);
  return this;
};

/*~
 * Transforms successful Eithers.
 * ---
 * category: Transforming
 * stability: experimental
 * type: |
 *   forall a, b, c:
 *     (Either a b).((b) => Either a c) => Either a c
 */
Right.prototype.chain = function(transformation) {
  assertFunction('Either.Right#chain', transformation);
  return transformation(this.value);
};




// -- Extracting values and recovering ---------------------------------

// NOTE:
// `get` is similar to Comonad's `extract`. The reason we don't implement
// Comonad here is that `get` is partial, and not defined for Left
// values.

/*~
 * Extracts the value of a successful Either.
 * ---
 * category: Extracting values
 * stability: experimental
 * type: |
 *   forall a, b: (Either a b).() => b :: throws TypeError
 */
Left.prototype.get = function() {
  throw new TypeError(`Can't extract the value of a Left.

Left does not contain a normal value - it contains an error.
You might consider switching from Either#get to Either#getOrElse, or some other method
that is not partial.
  `);
};

/*~
 * Extracts the value of a successful Either.
 * ---
 * category: Extracting values
 * stability: experimental
 * type: |
 *   forall a, b: (Either a b).() => b :: throws TypeError
 */
Right.prototype.get = function() {
  return this.value;
};


/*~
 * Extracts the value of a successful Either, or returns a fallback value.
 * ---
 * category: Extracting values
 * stability: experimental
 * type: |
 *   forall a, b: (Either a b).(b) => b
 */
Left.prototype.getOrElse = function(default_) {
  return default_;
};

/*~
 * Extracts the value of a successful Either, or returns a fallback value.
 * ---
 * category: Extracting values
 * stability: experimental
 * type: |
 *   forall a, b: (Either a b).(b) => b
 */
Right.prototype.getOrElse = function(_default_) {
  return this.value;
};

/*~
 * Recovers from a failed Either.
 * ---
 * category: Recovering
 * stability: experimental
 * type: |
 *   forall a, b, c: (Either a b).((a) => Either c b) => Either c b
 */
Left.prototype.orElse = function(handler) {
  return handler(this.value);
};

/*~
 * Recovers from a failed Either.
 * ---
 * category: Recovering
 * stability: experimental
 * type: |
 *   forall a, b, c: (Either a b).((a) => Either c b) => Either c b
 */
Right.prototype.orElse = function(_) {
  return this;
};

// -- Folds and extended transformations--------------------------------

/*~
 * Applies a function to each side of an Either.
 * ---
 * category: Pattern matching
 * stability: experimental
 * type: |
 *   forall a, b, c:
 *     (Either a b).((a) => c, (b) => c) => c
 */
Either.fold = function(f, g) {
  return this.matchWith({
    Left: ({ value }) => f(value),
    Right: ({ value }) => g(value)
  });
};


/*~
 * Returns the value of an Either regardless of its tag.
 * ---
 * category: Extracting values
 * stability: experimental
 * type: |
 *   forall a, b: (Either a b).() => a or b
 */
Either.merge = function() {
  return this.value;
};


/*~
 * Transforms failures in successes, and vice-versa.
 * ---
 * category: Transforming
 * stability: experimental
 * type: |
 *   forall a, b: (Either a b).() => Either b a
 */
Either.swap = function() {
  return this.fold(Right, Left);
};


/*~
 * Applies a function to each side of an Either.
 * ---
 * category: Transforming
 * stability: experimental
 * type: |
 *   forall a, b, c, d:
 *     (Either a b).((a) => c, (b) => d) => Either c d
 */
Either.bimap = function(f, g) {
  return this.matchWith({
    Left: ({ value }) => Left(f(value)),
    Right: ({ value }) => Right(g(value))
  });
};


/*~
 * Transforms failed Eithers.
 * ---
 * category: Transforming
 * stability: experimental
 * type: |
 *   forall a, b, c: (Either a b).((a) => c) => Either c b
 */
Left.prototype.leftMap = function(transformation) {
  assertFunction('Either.Left#leftMap', transformation);
  return Left(transformation(this.value));
};

/*~
 * Transforms failed Eithers.
 * ---
 * category: Transforming
 * stability: experimental
 * type: |
 *   forall a, b, c: (Either a b).((a) => c) => Either c b
 */
Right.prototype.leftMap = function(transformation) {
  assertFunction('Either.Right#leftMap', transformation);
  return this;
};

// -- Conversions -------------------------------------------------

/*~
 * Transforms an Either to a Validation.
 * ---
 * category: Converting
 * stability: experimental
 * type: |
 *   forall a, b: (Either a b).() => Validation a b
 */
Either.toValidation = function() {
  return require('folktale/data/conversions/either-to-validation')(this);
};


/*~
 * Transforms an Either to a Maybe. Left values are lost in the process.
 * ---
 * category: Converting
 * stability: experimental
 * type: |
 *   forall a, b: (Either a b).() => Maybe b
 */
Either.toMaybe = function() {
  return require('folktale/data/conversions/either-to-maybe')(this);
};

provideAliases(Left.prototype);
provideAliases(Right.prototype);
provideAliases(Either);

module.exports = Either;
