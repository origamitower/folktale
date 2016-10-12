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
const assert = require('assert');
const laws = require('../helpers/fantasy-land-laws');
const Maybe = require('folktale/data/maybe');
const { Just, Nothing } = Maybe;


describe('Data.Maybe', () => {

  describe('Conversions', () => {
    property('Just#fromEither', 'json', (a) => {
      return Maybe.fromEither(Just(a).toEither()).equals(Just(a));
    });
    property('Nothing#fromEither', 'json', (a) => {
      return Maybe.fromEither(Nothing().toEither()).equals(Nothing());
    });
  });

  describe('#map(f)', () => {
    property('Just(a).map(f) = Just(f(a))', 'nat', 'nat -> nat', (a, f) => {
      return Just(a).map(f).equals(Just(f(a)));
    });

    it('Nothing().map(f) = Nothing()', () => {
      let called = false;
      const f = () => { called = true };
      Nothing().map(f);
      $ASSERT(called === false);
    });
  });

  describe('#apply(a)', () => {
    property('Just(f).apply(a) = Just(f(a))', 'nat', 'nat -> nat', (a, f) => {
      return Just(f).apply(Just(a)).equals(Just(f(a)));
    });

    property('Just(f).apply(Nothing()) = Nothing()', 'nat -> nat', (f) => {
      return Just(f).apply(Nothing()).equals(Nothing());
    })

    property('Nothing().apply(a) = Nothing()', 'nat', (a) => {
      return Nothing().apply(Just(a)).equals(Nothing());
    });
  });

  describe('#of(a)', () => {
    property('Maybe.of(a) = Just(a)', 'json', (a) => {
      return Maybe.of(a).equals(Just(a));
    });
  });

  describe('#chain(f)', () => {
    property('Just(a).chain(f) = f(a)', 'json', 'json -> json', (a, f) => {
      return Just(a).chain(x => Just(f(x))).equals(Just(f(a)));
    });

    property('Nothing().chain(f) = Nothing()', 'json -> json', (f) => {
      return Nothing().chain(x => Just(f(x))).equals(Nothing());
    });
  });

  describe('#get()', () => {
    property('Just(a).get() = a', 'json', (a) => {
      return Just(a).get() === a;
    });

    it('Nothing().get() throws', () => {
      assert.throws(_ => Nothing().get());
    });
  });

  describe('#getOrElse(b)', () => {
    property('Just(a).getOrElse(b) = a', 'json', 'json', (a, b) => {
      return Just(a).getOrElse(b) === a;
    });

    property('Nothing().getOrElse(b) = b', 'json', (a) => {
      return Nothing().getOrElse(a) === a;
    });
  });

  describe('#orElse(f)', () => {
    property('Just(a).orElse(f) = Just(a)', 'json', 'json -> json', (a, f) => {
      return Just(a).orElse(x => Just(f(x))).equals(Just(a));
    });

    property('Nothing().orElse(f) = f()', 'json', 'json -> json', (a, f) => {
      return Nothing().orElse(x => Just(f(a))).equals(Just(f(a)));
    });
  });

  describe('#toEither(b)', () => {
    const { Left, Right } = require('folktale/data/either');
    
    property('Just(a).toEither(b) = Right(a)', 'json', 'json', (a, b) => {
      return Just(a).toEither(b).equals(Right(a));
    });

    property('Nothing().toEither(b) = Left(b)', 'json', 'json', (a, b) => {
      return Nothing().toEither(b).equals(Left(b));
    });
  });

  describe('#toValidation(b)', () => {
    const { Success, Failure } = require('folktale/data/validation');

    property('Just(a).toValidation(b) = Succcess(a)', 'json', 'json', (a, b) => {
      return Just(a).toValidation(b).equals(Success(a));
    });

    property('Nothing().toValidation(b) = Failure(b)', 'json', 'json', (a, b) => {
      return Nothing().toValidation(b).equals(Failure(b));
    });
  });

  describe('Fantasy Land', _ => {
    laws.Setoid(Maybe.Just);
    laws.Setoid(Maybe.Nothing);

    laws.Functor(Maybe.Just);
    laws.Functor(Maybe.Nothing);

    laws.Apply(Maybe.Just);
    laws.Apply(Maybe.Nothing);

    laws.Applicative(Maybe.Just);
    laws.Applicative(Maybe.Nothing);

    laws.Chain(Maybe.Just);
    laws.Chain(Maybe.Nothing);

    laws.Monad(Maybe.Just);
    laws.Monad(Maybe.Nothing);
  });
});
