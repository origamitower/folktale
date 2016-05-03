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

const { property, forall} = require('jsverify');
const {data, setoid} = require('../core/adt/')

describe('Data.ADT.derive', function() {
  describe('Setoid', function() {
    const _ = data({
      one: ['value'],
      two: ['value']
    }).derive(setoid())
    
    const one = (value) => new _.one.constructor({ value })
    const two = (value) => new _.two.constructor({ value })

    property('Different simple values are NOT equal', 'json', function(a) {
      return !one(a).equals(two(a))
    });
    property('Different recursive values are NOT equal', 'json', function(a) {
      return !one(two(a)).equals(one(a))
    });
    property('Similar simple values are equal', 'json', function(a) {
      return one(a).equals(one(a))
    });
    property('Similar recursive values are equal', 'json', function(a) {
      return one(two(a)).equals(one(two(a)))
    });
  });
});
