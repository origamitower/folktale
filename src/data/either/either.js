const assertType = require('folktale/helpers/assertType');
const assertFunction = require('folktale/helpers/assertFunction');
const { data, setoid, show } = require('folktale/core/adt/');
const provideAliases = require('folktale/helpers/provide-fantasy-land-aliases');

const Either = data('folktale:Data.Either', {
  Left(value)  { return { value } },
  Right(value) { return { value } }
}).derive(setoid, show);

const { Left, Right } = Either;

const assertEither = assertType(Either);

// -- Functor ----------------------------------------------------------
Left.prototype.map = function(transformation) {
  assertFunction('Either.Left#map', transformation);
  return this;
};

Right.prototype.map = function(transformation) {
  assertFunction('Either.Right#map', transformation);
  return Right(transformation(this.value));
};

// -- Apply ------------------------------------------------------------
Left.prototype.apply = function(anEither) {
  assertEither('Left#apply', anEither);
  return this;
};

Right.prototype.apply = function(anEither) {
  assertEither('Right#apply', anEither);
  return anEither.map(this.value);
};


// -- Applicative ------------------------------------------------------
Either.of = Right;

// -- Chain ------------------------------------------------------------
Left.prototype.chain = function(transformation) {
  assertFunction('Either.Left#chain', transformation);
  return this;
};

Right.prototype.chain = function(transformation) {
  assertFunction('Either.Right#chain', transformation);
  return transformation(this.value);
};




// -- Extracting values and recovering ---------------------------------

// NOTE:
// `get` is similar to Comonad's `extract`. The reason we don't implement
// Comonad here is that `get` is partial, and not defined for Left
// values.

Left.prototype.get = function() {
  throw new TypeError(`Can't extract the value of a Left.

Left does not contain a normal value - it contains an error.
You might consider switching from Either#get to Either#getOrElse, or some other method
that is not partial.
  `);
};

Right.prototype.get = function() {
  return this.value;
};

Left.prototype.getOrElse = function(default_) {
  return default_;
};

Right.prototype.getOrElse = function(_default_) {
  return this.value;
};

Left.prototype.orElse = function(handler) {
  return handler(this.value);
};

Right.prototype.orElse = function(_) {
  return this;
};

// -- Folds and extended transformations--------------------------------

Either.fold = function(f, g) {
  return this.matchWith({
    Left: ({ value }) => f(value),
    Right: ({ value }) => g(value)
  });
};

Either.merge = function() {
  return this.value;
};

Either.swap = function() {
  return this.fold(Right, Left);
};

Either.bimap = function(f, g) {
  return this.matchWith({
    Left: ({ value }) => Left(f(value)),
    Right: ({ value }) => Right(g(value))
  });
};

Left.prototype.leftMap = function(transformation) {
  assertFunction('Either.Left#leftMap', transformation);
  return Left(transformation(this.value));
};

Right.prototype.leftMap = function(transformation) {
  assertFunction('Either.Right#leftMap', transformation);
  return this;
};

// -- Conversions -------------------------------------------------
Left.prototype.toJSON = function() {
  return {
    '#type': 'folktale:Either.Left',
    value:   this.value
  };
};

Right.prototype.toJSON = function() {
  return {
    '#type': 'folktale:Either.Right',
    value:   this.value
  };
};

Either.toValidation = function(...args) {
  return require('folktale/data/conversions/either-to-validation')(this, ...args);
};

Either.toMaybe = function(...args) {
  return require('folktale/data/conversions/either-to-maybe')(this, ...args);
};

provideAliases(Left.prototype);
provideAliases(Right.prototype);
provideAliases(Either);

module.exports = Either;
