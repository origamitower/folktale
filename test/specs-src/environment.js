//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

const jsc = require('jsverify');
const bless = require('jsverify/lib/arbitraryBless');
const shrink = require('jsverify/lib/shrink');
const { Text } = require('../helpers/simple-structures');

//Accepts a random integer, and a size constraint, returns another integer that obeys the constraint.
const applySizeConstraint = (num, max) => num % (max + 1);

//Returns a deterministically-random element from an array based on a number
const getRandom = (elements, num) => elements[applySizeConstraint(num, elements.length - 1)];

const returns = (types) => (value) => bless({
  generator: (num) => getRandom(types, num).of(value.generator(num)),
  shrink: shrink.bless(() => []),
  show: (type) => type.toString()
});

const { maybe, result, validation, future, task } = require('folktale').data

module.exports = {
  monad: returns([maybe, result, Text]),
  bifunctor: returns([validation, result]),
  functor: returns([maybe, result, validation, Text]),
  applicative: returns([maybe, result, validation, Text]),
  semigroup: returns([Text]),
  monoid: returns([Text]),
  maybe: returns([maybe]),
  result: returns([result]),
  validation: returns([validation]),
  future: returns([future]),
  task: returns([task]),
  strict_setoid: returns([Text])
};
