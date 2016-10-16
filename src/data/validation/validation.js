const assertType = require('folktale/helpers/assertType');
const assertFunction = require('folktale/helpers/assertFunction');
const { data, setoid, show } = require('folktale/core/adt/');
const provideAliases = require('folktale/helpers/provide-fantasy-land-aliases');
const constant = require('folktale/core/lambda/constant');

const Validation = data('folktale:Data.Validation', {
  Failure(value) { return { value } },
  Success(value) { return { value } }
}).derive(setoid, show);

const { Success, Failure } = Validation;

const assertValidation = assertType(Validation);

// -- Functor ----------------------------------------------------------
Failure.prototype.map = function(transformation) {
  assertFunction('Validation.Failure#map', transformation);
  return this;
};
Success.prototype.map = function(transformation) {
  assertFunction('Validation.Success#map', transformation);
  return Success(transformation(this.value));
};

// -- Apply ------------------------------------------------------------
Failure.prototype.apply = function(aValidation) {
  assertValidation('Failure#apply', aValidation);
  return Failure.hasInstance(aValidation) ? Failure(this.value.concat(aValidation.value))
  :      /* otherwise */                    this;
};

Success.prototype.apply = function(aValidation) {
  assertValidation('Success#apply', aValidation);
  return Failure.hasInstance(aValidation) ? aValidation
  :      /* otherwise */                    aValidation.map(this.value);
};

// -- Applicative ------------------------------------------------------
Validation.of = Success;

// -- Extracting values and recovering ---------------------------------

// NOTE:
// `get` is similar to Comonad's `extract`. The reason we don't implement
// Comonad here is that `get` is partial, and not defined for Failure
// values.

Failure.prototype.get = function() {
  throw new TypeError(`Can't extract the value of a Failure.

Failure does not contain a normal value - it contains an error.
You might consider switching from Validation#get to Validation#getOrElse, or some other method
that is not partial.
  `);
};

Success.prototype.get = function() {
  return this.value;
};


// -- Semigroup --------------------------------------------------------
Validation.concat = function(aValidation) {
  assertValidation('Validation#concat', aValidation);
  return this.matchWith({
    Failure: ({ value }) => Failure.hasInstance(aValidation) ? Failure(value.concat(aValidation.value))
                            :     /* otherwise */              this,
    Success: (_) => aValidation
  });
};

// -- Extracting values and recovering ---------------------------------

// NOTE:
// `get` is similar to Comonad's `extract`. The reason we don't implement
// Comonad here is that `get` is partial, and not defined for Left
// values.

Failure.prototype.getOrElse = function(default_) {
  return default_;
};

Success.prototype.getOrElse = function(_default_) {
  return this.value;
};

Failure.prototype.orElse = function(handler) {
  return handler(this.value);
};

Success.prototype.orElse = function(_) {
  return this;
};

// -- Folds and extended transformations--------------------------------

Validation.fold = function(f, g) {
  return this.matchWith({
    Failure: ({ value }) => f(value),
    Success: ({ value }) => g(value)
  });
};

Validation.merge = function() {
  return this.value;
};

Validation.swap = function() {
  return this.fold(Success, Failure);
};

Validation.bimap = function(f, g) {
  return this.matchWith({
    Failure: ({ value }) => Failure(f(value)),
    Success: ({ value }) => Success(g(value))
  });
};

Success.prototype.failureMap = function(transformation) {
  assertFunction('Validation.Success#failureMap', transformation);
  return this;
};
Failure.prototype.failureMap = function(transformation) {
  assertFunction('Validation.Failure#failureMap', transformation);
  return Failure(transformation(this.value));
};


// -- Conversions -------------------------------------------------
Failure.prototype.toJSON = function() {
  return {
    '#type': 'folktale:Validation.Failure',
    value:   this.value
  };
};
Success.prototype.toJSON = function() {
  return {
    '#type': 'folktale:Validation.Success',
    value:   this.value
  };
};

Validation.toEither = function(...args) {
  return require('folktale/data/conversions/validation-to-either')(this, ...args);
};

Validation.toMaybe = function(...args) {
  return require('folktale/data/conversions/validation-to-maybe')(this, ...args);
};


provideAliases(Success.prototype);
provideAliases(Failure.prototype);
provideAliases(Validation);

module.exports = Validation;
