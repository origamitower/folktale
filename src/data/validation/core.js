const assertType = require('folktale/helpers/assertType');
const assertFunction = require('folktale/helpers/assertFunction');
const { data, setoid, show } = require('folktale/core/adt/');
const fl   = require('fantasy-land');
const constant = require('folktale/core/lambda/constant');

const Validation = data('folktale:Data.Validation', {
  Success(value) { return { value } },
  Failure(value) { return { value } }
}).derive(setoid, show);

const { Success, Failure } = Validation;

const assertValidation = assertType(Validation);

// -- Functor ----------------------------------------------------------
Success.prototype[fl.map] = function(transformation) {
  assertFunction('Validation.Success#map', transformation);
  return Success(transformation(this.value));
};
Failure.prototype[fl.map] = function(transformation) {
  assertFunction('Validation.Failure#map', transformation);
  return this;
};

// -- Apply ------------------------------------------------------------
Success.prototype[fl.ap]  = function(aValidation) {
  assertValidation('Success#ap', aValidation);
  return Failure.hasInstance(aValidation) ? aValidation
  :      /* otherwise */                    aValidation.map(this.value);
};

Failure.prototype[fl.ap]  = function(aValidation) {
  assertValidation('Failure#ap', aValidation);
  return Failure.hasInstance(aValidation) ? Failure(this.value.concat(aValidation.value))
  :      /* otherwise */                    aValidation.map(this.value);
};

// -- Applicative ------------------------------------------------------
Validation[fl.of] = Success;

// -- Extracting values and recovering ---------------------------------

// NOTE:
// `get` is similar to Comonad's `extract`. The reason we don't implement
// Comonad here is that `get` is partial, and not defined for Failure
// values.

Success.prototype.get = function() {
  return this.value;
};

Failure.prototype.get = function() {
  throw new TypeError(`Can't extract the value of a Failure.

Failure does not contain a normal value - it contains an error.
You might consider switching from Validation#get to Validation#getOrElse, or some other method
that is not partial.
  `);
};

// -- Semigroup --------------------------------------------------------
Validation[fl.concat] = function(aValidation) {
  assertValidation('Validation#concat', aValidation);
  return this.cata({
    Success: (_) => aValidation,
    Failure: ({ value }) => Failure.hasInstance(aValidation) ? Failure(value.concat(aValidation.value))
                            :     /* otherwise */              this
  });
};


// -- Monoid -----------------------------------------------------------
Validation[fl.empty] = constant(Success(x => x));

Success.prototype.getOrElse = function(_default_) {
  return this.value;
};

Failure.prototype.getOrElse = function(default_) {
  return default_;
};

Success.prototype.orElse = function(_) {
  return this;
};

Failure.prototype.orElse = function(handler) {
  return handler(this.value);
};


// -- Folds and extended transformations--------------------------------

Validation.fold = function(f, g) {
  return this.cata({
    Success: ({ value }) => f(value),
    Failure: ({ value }) => g(value)
  });
};

Validation.merge = function() {
  return this.value;
};

Validation.swap = function() {
  return this.fold(Failure, Success);
};

Validation.bimap = function(f, g) {
  return this.cata({
    Success: ({ value }) => Success(f(value)),
    Failure: ({ value }) => Failure(g(value))
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


// -- JSON conversions -------------------------------------------------
Success.prototype.toJSON = function() {
  return {
    '#type': 'folktale:Validation.Success',
    value:   this.value
  };
};

Failure.prototype.toJSON = function() {
  return {
    '#type': 'folktale:Validation.Failure',
    value:   this.value
  };
};

module.exports = Validation;
