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

//Returns a deterministically-random element from an array based on a number
const getRandom = (elements, num) => elements[applySizeConstraint(num, elements.length - 1)];

const returns = (types) => (value) => bless({
  generator: (num) => getRandom(types, num).of(value.generator(num)),
  shrink: shrink.bless(() => []),
  show: (type) => type.toString()
});

const { maybe, either, validation } = require('../../').data

module.exports = {
  monad: returns([maybe, either]),
  bifunctor: returns([validation, either]),
  functor: returns([maybe, either, validation]),
  applicative: returns([maybe, either, validation])
}
