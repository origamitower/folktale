const assertType = require('../../helpers/assertType');
const data = require('folktale/core/adt');
const { setoid } = require('folktale/core/adt/derive');
const fl   = require('fantasy-land');

const Either = data({
  Left:  ['value'],
  Right: ['value']
}).derive(setoid);

const _Left  = Either.Left;
const _Right = Either.Right;
const _Either = Either;


const assertFunction = (method, transformation) => {
  if (typeof transformation !== 'function') {
    throw new TypeError(`${method} expects a function, but was given ${transformation}.`);
  }
};

const assertEither = assertType(Either, 'Either');

// -- Constructors -----------------------------------------------------
const Left  = (value) => new Either.Left.constructor({ value });
const Right = (value) => new Either.Right.constructor({ value });

// -- Functor ----------------------------------------------------------
_Left.prototype[fl.map] = function(transformation) {
  assertFunction('Either.Left#map', transformation);
  return this;
};

_Right.prototype[fl.map] = function(transformation) {
  assertFunction('Either.Right#map', transformation);
  return Right(transformation(this.value));
};

// -- Apply ------------------------------------------------------------
_Left.prototype[fl.ap] = function(anEither) {
  assertEither('Either.Left#ap', anEither);
  return this;
};

_Right.prototype[fl.ap] = function(anEither) {
  assertEither('Either.Right#ap', anEither);
  return anEither.map(this.value);
};


// -- Applicative ------------------------------------------------------
Either[fl.of] = Right;

// -- Chain ------------------------------------------------------------
_Left.prototype[fl.chain] = function(transformation) {
  assertFunction('Either.Left#chain', transformation);
  return this;
};

_Right.prototype[fl.chain] = function(transformation) {
  assertFunction('Either.Right#chain', transformation);
  return transformation(this.value);
};


// -- Show -------------------------------------------------------------

// (for Object.prototype.toString)
Either[Symbol.toStringTag]    = '(folktale) Either';
_Left.prototype[Symbol.toStringTag]  = '(folktale) Either.Left';
_Right.prototype[Symbol.toStringTag] = '(folktale) Either.Right';

// (regular JavaScript representations)
Either.toString = () => '(folktale) Either';
_Left.prototype.toString = function() {
  return `(folktale) Either.Left(${this.value})`;
};

_Right.prototype.toString = function() {
  return `(folktale) Either.Right(${this.value})`;
};

// (Node REPL representations)
Either.inspect = Either.toString;
_Left.prototype.inspect  = _Left.prototype.toString;
_Right.prototype.inspect = _Right.prototype.toString;


// -- Extracting values and recovering ---------------------------------

// NOTE:
// `get` is similar to Comonad's `extract`. The reason we don't implement
// Comonad here is that `get` is partial, and not defined for Nothing
// values.

_Left.prototype.get = function() {
  throw new TypeError(`Can't extract the value of a Left.

Left does not contain a normal value - it contains an error.
You might consider switching from Either#get to Either#getOrElse, or some other method
that is not partial.
  `);
};

_Right.prototype.get = function() {
  return this.value;
};

_Left.prototype.getOrElse = function(default_) {
  return default_;
};

_Right.prototype.getOrElse = function(_default_) {
  return this.value;
};

_Left.prototype.orElse = function(handler) {
  return handler(this.value);
};

_Right.prototype.orElse = function(_) {
  return this;
};

// -- Folds and extended transformations--------------------------------

_Either.fold = function(f, g) {
  return this.cata({
    Left: ({ value }) => f(value),
    Right: ({ value }) => g(value)
  });
};

_Either.merge = function() {
  return this.value;
};

_Either.swap = function() {
  return this.fold(Right, Left);
};

_Either.bimap = function(f, g) {
  return this.cata({
    Left: ({ value }) => Left(f(value)),
    Right: ({ value }) => Right(g(value))
  });
};

_Left.prototype.leftMap = function(transformation) {
  assertFunction('Either.Left#leftMap', transformation);
  return Left(transformation(this.value));
};

_Right.prototype.leftMap = function(transformation) {
  assertFunction('Either.Right#leftMap', transformation);
  return this;
};

// -- JSON conversions -------------------------------------------------
_Left.prototype.toJSON = function() {
  return {
    '#type': 'folktale:Either.Left',
    value:   this.value
  };
};

_Right.prototype.toJSON = function() {
  return {
    '#type': 'folktale:Either.Right',
    value:   this.value
  };
};


module.exports = {
  Left,
  Right,
  type: Either,
  of: Either.of,
};
