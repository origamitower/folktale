//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

const { property, forall} = require('jsverify');
const assert = require('assert');
const laws = require('../../../helpers/fantasy-land-laws');
const Maybe = require('folktale/maybe');
const { Just, Nothing } = Maybe;


describe('Maybe', () => {

  describe('Conversions', () => {
    property('Just#fromResult', 'json', (a) => {
      return Maybe.fromResult(Just(a).toResult()).equals(Just(a));
    });
    property('Nothing#fromResult', 'json', (a) => {
      return Maybe.fromResult(Nothing().toResult()).equals(Nothing());
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

  describe('#filter(f)', () => {
    property('Just(a).filter(() => true) = Just(a)', 'json', 'json -> json', (a, f) => {
      return Just(a).filter(() => true).equals(Just(a));
    });

    property('Just(a).filter(() => false) = Nothing()', 'json', 'json -> json', (a, f) => {
      return Just(a).filter(() => false).equals(Nothing());
    });

    property('Nothing().filter(() => true) = Nothing()', 'json', 'json -> json', (a, f) => {
      return Nothing().filter(() => true).equals(Nothing());
    });

    property('Nothing().filter(() => false) = Nothing()', 'json', 'json -> json', (a, f) => {
      return Nothing().filter(() => false).equals(Nothing());
    });
  });

  describe('#unsafeGet()', () => {
    property('Just(a).unsafeGet() = a', 'json', (a) => {
      return Just(a).unsafeGet() === a;
    });

    it('Nothing().unsafeGet() throws', () => {
      assert.throws(_ => Nothing().unsafeGet());
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

  describe('#toResult(b)', () => {
    const { Error, Ok } = require('folktale/result');

    property('Just(a).toResult(b) = Right(a)', 'json', 'json', (a, b) => {
      return Just(a).toResult(b).equals(Ok(a));
    });

    property('Nothing().toResult(b) = Error(b)', 'json', 'json', (a, b) => {
      return Nothing().toResult(b).equals(Error(b));
    });
  });

  describe('#toValidation(b)', () => {
    const { Success, Failure } = require('folktale/validation');

    property('Just(a).toValidation(b) = Succcess(a)', 'json', 'json', (a, b) => {
      return Just(a).toValidation(b).equals(Success(a));
    });

    property('Nothing().toValidation(b) = Failure(b)', 'json', 'json', (a, b) => {
      return Nothing().toValidation(b).equals(Failure(b));
    });
  });

  describe('#empty()', () => {
    property('empty().equals(Nothing()) = true', () => {
      return Maybe.empty().equals(Nothing());
    });

    property('!(empty().equals(Just(a))) = false', 'nat', (a) => {
      return !(Maybe.empty().equals(Just(a)));
    });
  });

  describe('#concat(a)', () => {
    property('Just(a).concat(Nothing()) = Just(a)', 'string', (a) => {
      return Just(a).concat(Maybe.empty()).equals(Just(a));
    });

    property('Nothing().concat(Just(a)) = Nothing()', 'string', (a) => {
      return Maybe.empty().concat(Just(a)).equals(Just(a));
    });

    property('Just(a).concat(Just(b)) = Just(c)', 'string', 'string', (a, b) => {
      return Just(a).concat(Just(b)).equals(Just(a.concat(b)));
    });
  });

  describe('#alt(f)', () => {
    property('Nothing().alt(Just(a)).alt(Just(b)) = Nothing().alt(Just(a).alt(Just(b)))', 'nat', 'nat', (a, b) => {
      return Nothing().alt(Just(a)).alt(Just(b)).equals(Nothing().alt(Just(a).alt(Just(b))));
    });

    property('Just(a).alt(Just(b)).map(f) = Just(a).map(f).alt(Just(b).map(f))', 'nat', 'nat', (a, b) => {
      const f = x => x + 1;
      return Just(a).alt(Just(b)).map(f).equals(Just(a).map(f).alt(Just(b).map(f)));
    });
  });

  describe('Fantasy Land', _ => {
    laws.Setoid(Maybe.Just);
    laws.Setoid(Maybe.Nothing);

    laws.Semigroup(Maybe.Just);
    laws.Semigroup(Maybe.Nothing);

    laws.Monoid(Maybe.Just);
    laws.Monoid(Maybe.Nothing);

    laws.Functor(Maybe.Just);
    laws.Functor(Maybe.Nothing);

    laws.Apply(Maybe.Just);
    laws.Apply(Maybe.Nothing);

    laws.Applicative(Maybe.Just);
    laws.Applicative(Maybe.Nothing);

    laws.Alt(Maybe.Just);
    laws.Alt(Maybe.Nothing);

    laws.Chain(Maybe.Just);
    laws.Chain(Maybe.Nothing);

    laws.Monad(Maybe.Just);
    laws.Monad(Maybe.Nothing);
  });
});
