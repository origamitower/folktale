//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Copyright (C) 2015-2016 Quildreen Motta.
// Licensed under the MIT licence.
//
// See LICENCE for licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

const assertType = require('folktale/helpers/assertType');
const assertFunction = require('folktale/helpers/assertFunction');
const { data, show, setoid} = require('folktale/core/adt');

const fl   = require('fantasy-land');

const Maybe = data('folktale:Data.Maybe', {
  Nothing()   { },
  Just(value) { return { value } }
}).derive(setoid, show);

const { Nothing, Just } = Maybe;

const assertMaybe = assertType(Maybe);

// -- Setoid -----------------------------------------------------------
Nothing.prototype[fl.equals] = function(aMaybe) {
  assertMaybe('Maybe.Nothing#equals', aMaybe);
  return aMaybe.isNothing;
};

Just.prototype[fl.equals] = function(aMaybe) {
  assertMaybe('Maybe.Just#equals', aMaybe);
  return aMaybe.isJust && aMaybe.value === this.value;
};


// -- Functor ----------------------------------------------------------
Nothing.prototype[fl.map] = function(transformation) {
  assertFunction('Maybe.Nothing#map', transformation);
  return this;
};

Just.prototype[fl.map] = function(transformation) {
  assertFunction('Maybe.Nothing#map',  transformation);
  return Just(transformation(this.value));
};


// -- Apply ------------------------------------------------------------
Nothing.prototype[fl.ap] = function(aMaybe) {
  assertMaybe('Maybe.Nothing#ap', aMaybe);
  return this;
};

Just.prototype[fl.ap] = function(aMaybe) {
  assertMaybe('Maybe.Just#ap', aMaybe);
  return aMaybe.map(this.value);
};

// -- Applicative ------------------------------------------------------
Maybe[fl.of] = Just;


// -- Chain ------------------------------------------------------------
Nothing.prototype[fl.chain] = function(transformation) {
  assertFunction('Maybe.Nothing#chain', transformation);
  return this;
};

Just.prototype[fl.chain] = function(transformation) {
  assertFunction('Maybe.Just#chain', transformation);
  return transformation(this.value);
};

// -- Extracting values and recovering ---------------------------------

// NOTE:
// `get` is similar to Comonad's `extract`. The reason we don't implement
// Comonad here is that `get` is partial, and not defined for Nothing
// values.

Nothing.prototype.get = function() {
  throw new TypeError(`Can't extract the value of a Nothing.

Since Nothing holds no values, it's not possible to extract one from them.
You might consider switching from Maybe#get to Maybe#getOrElse, or some other method
that is not partial.
  `);
};

Just.prototype.get = function() {
  return this.value;
};



Nothing.prototype.getOrElse = function(default_) {
  return default_;
};

Just.prototype.getOrElse = function(_default_) {
  return this.value;
};



Nothing.prototype.orElse = function(handler) {
  return handler();
};

Just.prototype.orElse = function() {
  return this;
};


// -- Conversions -------------------------------------------------
Nothing.prototype.toJSON = function() {
  return {
    '#type': 'folktale:Maybe.Nothing'
  };
};

Just.prototype.toJSON = function() {
  return {
    '#type': 'folktale:Maybe.Just',
    value:   this.value
  };
};

Maybe.toEither = function(...args) {
  return require('folktale/data/conversions/maybe-to-either')(this, ...args);
};

Maybe.toValidation = function(...args) {
  return require('folktale/data/conversions/maybe-to-validation')(this, ...args);
};


// -- Exports ----------------------------------------------------------
module.exports = Maybe;

// -- Annotations ------------------------------------------------------
if (process.env.NODE_ENV !== 'production') {
  module.exports[Symbol.for('@@meta:magical')] = {
    name: 'Maybe',
    category: 'Data Structures',
    stability: 'experimental',
    platforms: ['ECMAScript 3'],
    portability: 'Portable',
    authors: ['Quildreen Motta'],
    module: 'folktale/data/maybe/core',
    licence: 'MIT',
    seeAlso: [{
      type: 'link',
      title: 'A Monad in Practicality: First-Class Failures',
      url: 'http://robotlolita.me/2013/12/08/a-monad-in-practicality-first-class-failures.html'
    }],
    documentation: `
The Maybe module provides a data structure to represent values that
might not be present, or the result of computations that may fail.

The data structure models two different cases:

 -  \`Just α\`, which represents any value, including \`null\` and \`undefined\`.
 -  \`Nothing\`, which represents the abscence of a value.

The idea is that, by explicitly modelling these failures, and forcing
the user to deal with the failures to get to the value, we can get rid
of common problems such as \`TypeError: undefined is not a function\`.
In other words, this data structure helps writing programs that are
correct by construction, because they force the user to deal with
all *potential* failures.
    `
  };
}
