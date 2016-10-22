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
const _ = require('folktale/data/either');
const laws = require('../helpers/fantasy-land-laws');

describe('Data.Either', function() {

  describe('constructors', () => {
    property('try#Left', 'json', (a) => {
        return _.try(() => {throw a }).equals(_.Left(a))
    });

    property('try#Right', 'json', (a) => {
        return _.try(() => (a)).equals(_.Right(a))
    }); 
  });

  describe('Functor', () => {
    property('map', 'json', 'json -> json', (a, f) => {
      return _.of(f(a)).equals(_.of(a).map(f))
    });
    
    property('Left#map', 'json', 'json -> json', (a, f) => {
      return _.Left(a).map(f).equals(_.Left(a))
    });
  });

  describe('Applicative', () => {
    property('of', 'json', 'json', (a, b) => {
      return (a === b) === (_.of(a).equals(_.of(b)))
    });

    property('apply', 'json', 'json -> json', (a, f) => {
      return _.of(f).apply(_.of(a)).equals(_.of(f(a)))
    });
  });

  describe('Chain', () => {
    const lift = (f) => a => _.of(f(a))
    property('chain', 'json', 'json -> json', (a, f) => {
      return  _.of(a).chain(lift(f)).equals(lift(f)(a))
    });

    property('Left#chain', 'json', 'json -> json', (a, f) => {
      return _.Left(a).chain(lift(f)).equals(_.Left(a))
    });
  });

  describe('extracting/recovering', () => {
    property('Left#getOrElse', 'json', 'json', (a, b) => {
      return _.Left(b).getOrElse(a) === a
    });
    property('Right#getOrElse', 'json', 'json', (a, b) => {
      return _.Right(b).getOrElse(a) === b
    });

    property('Left#orElse', 'json', 'json', (a, b) => {
      return _.Left(b).orElse(() => a) === a
    });
    property('Right#orElse', 'json', 'json', (a, b) => {
      return _.Right(b).orElse(() => b).equals(_.Right(b))
    });
  });
  describe('folds', () => {
    const id = (a) => a
    property('Left#fold', 'json', 'json -> json', (a, f) => {
      return _.Left(a).fold(f, id) === f(a)
    });
    property('Right#fold', 'json', 'json -> json', (a, f) => {
      return _.Right(a).fold(id, f) === f(a)
    });

    property('Left#merge', 'json', (a) => {
      return _.Left(a).merge() === a 
    });
    property('Right#merge', 'json', (a) => {
      return _.Right(a).merge() === a 
    });

    property('Left#swap', 'json', (a) => {
      return _.Left(a).swap().equals(_.Right(a))
    });
    property('Right#swap', 'json', (a) => {
      return _.Right(a).swap().equals(_.Left(a))
    });

    property('Left#bimap', 'json', 'json -> json', (a, f) => {
      return _.Left(a).bimap(f, id).equals(_.Left(f(a)))
    });
    property('Right#bimap', 'json', 'json -> json', (a, f) => {
      return _.Right(a).bimap(id, f).equals(_.Right(f(a)))
    });

    property('Left#leftMap', 'json', 'json -> json', (a, f) => {
      return _.Left(f(a)).equals(_.Left(a).leftMap(f))
    });
    
    property('Right#leftMap', 'json', 'json -> json', (a, f) => {
      return _.Right(a).leftMap(f).equals(_.Right(a))
    });
  });
  describe('Conversions', () => {
    property('Left#fromNullable', () => {
      return _.fromNullable(null).equals(_.Left(null));
    });

    property('Right#fromNullable', 'json', (a) => {
      return _.fromNullable(a).equals(_.Right(a));
    });
    property('Either#fromValidation', 'json', (a) => {
      return _.fromValidation(_.Left(a).toValidation()).equals(_.Left(a));
    });
    property('Left#fromMaybe', 'string', 'string', (a, b) => {
      return _.fromMaybe(_.Left(b).toMaybe(), b).equals(_.Left(b));
    });
    property('Right#fromMaybe', 'json', 'json', (a, b) => {
      return _.fromMaybe(_.Right(a).toMaybe(), b).equals(_.Right(a));
    });
  });

  describe('Fantasy Land', () => {
    laws.Setoid(_.Left);
    laws.Setoid(_.Right);

    laws.Functor(_.Left);
    laws.Functor(_.Right);

    laws.Apply(_.Left);
    laws.Apply(_.Right);

    laws.Applicative(_.Left);
    laws.Applicative(_.Right);

    laws.Chain(_.Left);
    laws.Chain(_.Right);

    laws.Monad(_.Left);
    laws.Monad(_.Right);

    laws.Bifunctor((a, b) => _.Left(a));
    laws.Bifunctor((a, b) => _.Right(b));
  });
});
