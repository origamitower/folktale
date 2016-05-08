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

    property('fromNullable#Right', 'json', function(a) {
        return _.fromNullable(a).equals(_.Right(a))
    }); 

    property('try#Left', 'json', function(a) {
        return _.try((a) => {throw a })(a).equals(_.Left(a))
    });

    property('try#Right', 'json', function(a) {
        return _.try(() => (a))(a).equals(_.Right(a))
    }); 
  });

  describe('Functor', function () {
    property('map', 'json', 'json -> json', function(a, f) {
      return _.of(f(a)).equals(_.of(a).map(f))
    });
    
    property('Left#map', 'json', 'json -> json', function(a, f) {
      return _.Left(a).map(f).equals(_.Left(a))
    });
  });

  describe('Applicative', function () {
    property('of', 'json', 'json', function(a, b) {
      return (a === b) === (_.of(a).equals(_.of(b)))
    });

    property('ap', 'json', 'json -> json', function(a, f) {
      return _.of(f).ap(_.of(a)).equals(_.of(f(a)))
    });
  });

  describe('Chain', function () {
    const lift = (f) => a => _.of(f(a))
    property('chain', 'json', 'json -> json', function(a, f) {
      return  _.of(a).chain(lift(f)).equals(lift(f)(a))
    });

    property('Left#chain', 'json', 'json -> json', function(a, f) {
      return _.Left(a).chain(lift(f)).equals(_.Left(a))
    });
  });

  describe('extracting/recovering', function () {
    property('Left#getOrElse', 'json', 'json', function(a, b) {
      return _.Left(b).getOrElse(a) === a
    });
    property('Right#getOrElse', 'json', 'json', function(a, b) {
      return _.Right(b).getOrElse(a) === b
    });

    property('Left#orElse', 'json', 'json', function(a, b) {
      return _.Left(b).orElse(() => a) === a
    });
    property('Right#orElse', 'json', 'json', function(a, b) {
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
      return _.Left(f(a)).equals(_.Left(a).leftMap(f))
    });
    
    property('Right#leftMap', 'json', 'json -> json', function(a, f) {
      return _.Right(a).leftMap(f).equals(_.Right(a))
    });
  });
});
