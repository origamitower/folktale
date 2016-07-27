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
const {data, setoid, show, serialize} = require('../core/adt/')

describe('Data.ADT.derive', function() {
  describe('Setoid', function() {
    const { A, B } = data('AB', {
      A: (value) => ({ value }),
      B: (value) => ({ value })
    }).derive(setoid)
    
    property('Different simple values are NOT equal', 'json', function(a) {
      return !A(a).equals(B(a))
    });
    property('Different composite values are NOT equal', 'json', function(a) {
      return !A(B(a)).equals(A(a))
    });
    property('Similar simple values are equal', 'json', function(a) {
      return A(a).equals(A(a))
    });
    property('Similar composite values are equal', 'json', function(a) {
      return A(B(a)).equals(A(B(a)))
    });

    describe('Setoid#withEquality', function() {

      const { A } = data('A', {
        A: (value) => ({ value }),
      }).derive(setoid.withEquality((a, b) => a.id === b.id));
      
      property('Values are compared using a custom function if provided', 'json', 'json', function(a, b) {
        return A({id:1, _irrelevantValue:a}).equals(A({id:1, _irrelevantValue: b}))
      });
    });
  });
  describe('Show', function() {
    const AB = data('AB', {
      A: (value) => ({ value }),
      B: (value) => ({ value })
    }).derive(show)

    property('Types have a string representation', function() {
      return AB.toString()  === 'AB';
    })

    property('Variants have a string representation', function() {
      return AB.A.toString()  === 'AB.A';
    })
    property('Primitive Values have a string representation', function() {
      return AB.A(1).toString()  === 'AB.A({ value: 1 })';
    })
    property('Complex Values have a string representation', function() {
      return AB.A({foo: "bar"}).toString()  === 'AB.A({ value: { foo: "bar" } })';
    })
    property('Functions have a string representation', function() {
      return AB.A((a) => a ).toString()  === 'AB.A({ value: [Function] })';
    })
    property('Named functions have a string representation', function() {
      return AB.A(function foo(){ }).toString()  === 'AB.A({ value: [Function: foo] })';
    })
    property('Symbols have a string representation', function() {
      console.log(AB.A(Symbol('foo')).toString())
      return AB.A(Symbol('foo')).toString()  === 'AB.A({ value: Symbol(foo) })';
    })
    property('Recursive Values have a string representation', function() {
      return AB.A({rec:AB.A(1)}).toString()  ===  'AB.A({ value: { rec: AB.A({ value: 1 }) } })'
    })
  });
  describe('Serialize', function() {
    const AB = data('folktale:AB', {
      A: (value) => ({ value }),
      B: (value) => ({ value })
    }).derive(serialize, setoid);
    
    const CD = data('folktale:CD', {
      C: (value) => ({value}),
      D: (value) => ({value})
    }).derive(serialize, setoid);

    const {A, B} = AB;
    const {C, D} = CD;

    property('Serializing a value and deserializing it yields a similar value', 'json', function(a) {
      return AB.fromJSON(A(a).toJSON()).equals(A(a))
    })
    property('Serializing a *recursive* value and deserializing it yields a similar value', 'json', function(a) {
      return AB.fromJSON(A(B(a)).toJSON()).equals(A(B(a)))
    })

    property('Serializing a *composite* value and deserializing it yields a similar value (when the proper parsers are provided).', 'json', function(a) {
      return AB.fromJSON(A(B(C(a))).toJSON(), {AB, CD}).equals(A(B(C(a))))
    })
  });
});
