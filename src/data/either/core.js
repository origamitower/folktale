const data = require('folktale/core/adt').data;
const fl   = require('fantasy-land');

const Either = data('folktale:Data.Either', {
  Left(value)  { return { value } },
  Right(value) { return { value } }
});

const { Left, Right } = Either;

//TODO place in a separate file for other modules to use.
const assertType = (typeName, type) => (method, value) => {
  if (process.env.NODE_ENV !== 'production' && !(type.isPrototypeOf(value))) {
    console.warn(`
${method} expects a value of the same type, but was given ${value}.

This could mean that you've provided the wrong value to the method, in
which case this is a bug in your program, and you should try to track
down why the wrong value is getting here.

But this could also mean that you have more than one ${typeName} library
instantiated in your program. This is not **necessarily** a bug, it
could happen for several reasons:

 1) You're loading the library in Node, and Node's cache didn't give
    you back the same instance you had previously requested.

 2) You have more than one Code Realm in your program, and objects
    created from the same library, in different realms, are interacting.

 3) You have a version conflict of folktale libraries, and objects
    created from different versions of the library are interacting.

If your situation fits the cases (1) or (2), you are okay, as long as
the objects originate from the same version of the library. Folktale
does not rely on reference checking, only structural checking. However
you'll want to watch out if you're modifying the ${typeName}'s prototype,
because you'll have more than one of them, and you'll want to make
sure you do the same change in all of them — ideally you shouldn't
be modifying the object, though.

If your situation fits the case (3), you are *probably* okay if the
version difference isn't a major one. However, at this point the
behaviour of your program using ${typeName} is undefined, and you should
try looking into why the version conflict is happening.

Parametric modules can help ensuring your program only has a single
instance of the folktale library. Check out the Folktale Architecture
documentation for more information.
    `);
  }
};

const assertFunction = (method, transformation) => {
  if (typeof transformation !== 'function') {
    throw new TypeError(`${method} expects a function, but was given ${transformation}.`);
  }
};

const assertEither = assertType('Either', Either);


// -- Setoid -----------------------------------------------------------
Left.prototype[fl.equals] = function(anEither) {
  assertEither('Either.Left#equals', anEither);
  return anEither.isLeft === true && anEither.value === this.value;
};

Right.prototype[fl.equals] = function(anEither) {
  assertEither('Either.Right#equals', anEither);
  return anEither.isRight && anEither.value === this.value;
};

// -- Functor ----------------------------------------------------------
Left.prototype[fl.map] = function(transformation) {
  assertFunction('Either.Left#map', transformation);
  return this;
};

Right.prototype[fl.map] = function(transformation) {
  assertFunction('Either.Right#map', transformation);
  return Right(transformation(this.value));
};

// -- Apply ------------------------------------------------------------
Left.prototype[fl.ap] = function(anEither) {
  assertEither('Either.Left#ap', anEither);
  return this;
};

Right.prototype[fl.ap] = function(anEither) {
  assertEither('Either.Right#ap', anEither);
  return anEither.map(this.value);
};


// -- Applicative ------------------------------------------------------
Either[fl.of] = Right;

// -- Chain ------------------------------------------------------------
Left.prototype[fl.chain] = function(transformation) {
  assertFunction('Either.Left#chain', transformation);
  return this;
};

Right.prototype[fl.chain] = function(transformation) {
  assertFunction('Either.Right#chain', transformation);
  return transformation(this.value);
};


// -- Show -------------------------------------------------------------

// (for Object.prototype.toString)
Either[Symbol.toStringTag]    = '(folktale) Either';
Left.prototype[Symbol.toStringTag]  = '(folktale) Either.Left';
Right.prototype[Symbol.toStringTag] = '(folktale) Either.Right';

// (regular JavaScript representations)
Either.toString = () => '(folktale) Either';
Left.prototype.toString = function() {
  return `(folktale) Either.Left(${this.value})`;
};

Right.prototype.toString = function() {
  return `(folktale) Either.Right(${this.value})`;
};

// (Node REPL representations)
Either.inspect = Either.toString;
Left.prototype.inspect  = Left.prototype.toString;
Right.prototype.inspect = Right.prototype.toString;


// -- Extracting values and recovering ---------------------------------

// NOTE:
// `get` is similar to Comonad's `extract`. The reason we don't implement
// Comonad here is that `get` is partial, and not defined for Nothing
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
  return this.cata({
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
  return this.cata({
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

// -- JSON conversions -------------------------------------------------
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


module.exports = {
  Left,
  Right,
  type: Either,
  of: Either.of,
};
