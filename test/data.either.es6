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
const _ = require('../').data.either;

describe('Data.Either', function() {

  describe('constructors', function () {
    property('fromNullable#Left', function() {
        return _.fromNullable(null).equals(_.Left(null))
    });

    property('fromNullable#Right', 'integer', function(a) {
        return _.fromNullable(a).equals(_.Right(a))
    }); 

    property('try#Left', 'integer', function(a) {
        return _.try((a) => {throw a })(a).equals(_.Left(a))
    });

    property('try#Right', 'integer', function(a) {
        return _.try(() => (a))(a).equals(_.Right(a))
    }); 
  });

  describe('Setoid', function () {
    property('Left#equals', 'integer', 'integer', function(a, b) {
      return (a === b) === (_.Left(a).equals(_.Left(b)))
    });

    property('Right#equals', 'integer', 'integer', function(a, b) {
      return (a === b) === (_.Right(a).equals(_.Right(b)))
    });

    property('Left#equals and Right#equals', 'integer', function(a) {
      return !(_.Left(a).equals(_.Right(a)))
    });
  });

  describe('Functor', function () {
    property('map', 'integer', 'integer -> integer', function(a, f) {
      return _.of(f(a)).equals(_.of(a).map(f))
    });
    
    property('Left#map', 'integer', 'integer -> integer', function(a, f) {
      return _.Left(a).map(f).equals(_.Left(a))
    });
  });

  describe('Applicative', function () {
    property('of', 'integer', 'integer', function(a, b) {
      return (a === b) === (_.of(a).equals(_.of(b)))
    });

    property('ap', 'integer', 'integer -> integer', function(a, f) {
      return _.of(f).ap(_.of(a)).equals(_.of(f(a)))
    });
  });

  describe('Chain', function () {
    const lift = (f) => a => _.of(f(a))
    property('chain', 'integer', 'integer -> integer', function(a, f) {
      return  _.of(a).chain(lift(f)).equals(lift(f)(a))
    });

    property('Left#chain', 'integer', 'integer -> integer', function(a, f) {
      return _.Left(a).chain(lift(f)).equals(_.Left(a))
    });
  });

  describe('extracting/recovering', function () {
    property('Left#getOrElse', 'integer', 'integer', function(a, b) {
      return _.Left(b).getOrElse(a) === a
    });
    property('Right#getOrElse', 'integer', 'integer', function(a, b) {
      return _.Right(b).getOrElse(a) === b
    });

    property('Left#orElse', 'integer', 'integer', function(a, b) {
      return _.Left(b).orElse(() => a) === a
    });
    property('Right#orElse', 'integer', 'integer', function(a, b) {
      return _.Right(b).orElse(() => b).equals(_.Right(b))
    });
  });
  describe('folds', function () {
    const id = (a) => a
    property('Left#fold', 'json', 'json -> json', function(a, f) {
      return _.Left(a).fold(f, id) === f(a)
    });
    property('Right#fold', 'json', 'json -> json', function(a, f) {
      return _.Right(a).fold(id, f) === f(a)
    });

    property('Left#merge', 'json', function(a) {
      return _.Left(a).merge() === a 
    });
    property('Right#merge', 'json', function(a) {
      return _.Right(a).merge() === a 
    });

    property('Left#swap', 'json', function(a) {
      return _.Left(a).swap().equals(_.Right(a))
    });
    property('Right#swap', 'json', function(a) {
      return _.Right(a).swap().equals(_.Left(a))
    });

    property('Left#bimap', 'json', 'json -> json', function(a, f) {
      return _.Left(a).bimap(f, id).equals(_.Left(f(a)))
    });
    property('Right#bimap', 'json', 'json -> json', function(a, f) {
      return _.Right(a).bimap(id, f).equals(_.Right(f(a)))
    });

    property('Left#leftMap', 'json', 'json -> json', function(a, f) {
      debugger
      return _.Left(f(a)).equals(_.Left(a).leftMap(f))
    });
    
    property('Right#leftMap', 'json', 'json -> json', function(a, f) {
      return _.Right(a).leftMap(f).equals(_.Right(a))
    });
  });
});
