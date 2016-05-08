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

const { data } = require('folktale/core/adt');

const fl   = require('fantasy-land');

const Maybe = data('folktale:Data.Maybe', {
  Nothing()   { },
  Just(value) { return { value } }
});

const { Nothing, Just } = Maybe;


// -- Assertions -------------------------------------------------------
const assertMaybe = (method, value) => {
  if (process.env.NODE_ENV !== 'production' && !(value instanceof Maybe)) {
    console.warn(`
${method} expects a value of the same type, but was given ${value}.

This could mean that you've provided the wrong value to the method, in
which case this is a bug in your program, and you should try to track
down why the wrong value is getting here.

But this could also mean that you have more than one Maybe library
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
you'll want to watch out if you're modifying the Maybe's prototype,
because you'll have more than one of them, and you'll want to make
sure you do the same change in all of them — ideally you shouldn't
be modifying the object, though.

If your situation fits the case (3), you are *probably* okay if the
version difference isn't a major one. However, at this point the
behaviour of your program using Maybe is undefined, and you should
try looking into why the version conflict is happening.

Parametric modules can help ensuring your program only has a single
instance of the folktale library. Check out the Folktale Architecture
documentation for more information.
    `);
  }
};


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
  if (typeof transformation !== 'function') {
    throw new TypeError(`Maybe.Nothing#map expects a function, but was given ${transformation}.`);
  }

  return this;
};

Just.prototype[fl.map] = function(transformation) {
  if (typeof transformation !== 'function') {
    throw new TypeError(`Maybe.Just#map expects a function, but was given ${transformation}.`);
  }

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
  if (typeof transformation !== 'function') {
    throw new TypeError(`Maybe.Nothing#chain expects a function, but was given ${transformation}.`);
  }

  return this;
};

Just.prototype[fl.chain] = function(transformation) {
  if (typeof transformation !== 'function') {
    throw new TypeError(`Maybe.Just#chain expects a function, but was given ${transformation}.`);
  }

  return transformation(this.value);
};


// -- Show -------------------------------------------------------------

// (for Object.prototype.toString)
Maybe[Symbol.toStringTag]    = '(folktale) Maybe';
Nothing.prototype[Symbol.toStringTag] = '(folktale) Maybe.Nothing';
Just.prototype[Symbol.toStringTag]    = '(folktale) Maybe.Just';

// (regular JavaScript representations)
Maybe.toString = () => '(folktale) Maybe';
Nothing.prototype.toString = () => '(folktale) Maybe.Nothing()';

Just.prototype.toString = function() {
  return `(folktale) Maybe.Just(${this.value})`;
};

// (Node REPL representations)
Maybe.inspect = Maybe.toString;
Nothing.prototype.inspect = Maybe.Nothing.prototype.toString;
Just.prototype.inspect = Maybe.Just.prototype.toString;


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


// -- JSON conversions -------------------------------------------------
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


// -- Exports ----------------------------------------------------------
module.exports = {
  Nothing: Nothing,
  Just: Just,
  type: Maybe
};


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
