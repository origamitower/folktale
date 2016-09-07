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

const jsc = require('jsverify');
const bless = require('jsverify/lib/arbitraryBless');
const shrink = require('jsverify/lib/shrink');

//Accepts a random integer, and a size constraint, returns another integer that obeys the constraint.
const applySizeConstraint = (num, max) => num % (max + 1);

//An array containing various monad constructors from folktale
const monads = [require('../data/maybe'), require('../data/either')];

//Returns a random monad constructor
const getRandomMonad = (num) => monads[applySizeConstraint(num, monads.length - 1)];

const monad = (value) => bless({
  generator: (num) => getRandomMonad(num).of(value.generator(num)),
  shrink: shrink.bless(() => []),
  show: (monad) => monad.toString()
});

module.exports = {
  monad
}
