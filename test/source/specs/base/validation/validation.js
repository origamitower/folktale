//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

const { property, forall} = require('jsverify');
const _ = require('folktale/validation');
const laws = require('../../../helpers/fantasy-land-laws');


describe('Validation', () => {
  describe('collect(validations)', () => {
    it('failures are concatenated', () => {
      const a = _.Failure('a');
      const b = _.Failure('b');

      $ASSERT(_.collect([a, b]) == _.Failure('ab'));
    });

    it('successes are ignored in the presence of failures', () => {
      const a = _.Failure('a');
      const b = _.Failure('b');
      const c = _.Success('c');

      $ASSERT(_.collect([a, b, c]) == _.Failure('ab'));
    });

    it('keeps the last success', () => {
      const a = _.Success(1);
      const b = _.Success(2);

      $ASSERT(_.collect([a, b]) == _.Success(2));
    });
  });

  describe('chain(validation, fn)', () => {
    const lift = (f) => a => _.of(f(a));

    property('chain', 'json', 'json -> json', (a, f) => {
      return _.chain(_.Success(a), lift(f)).equals(lift(f)(a));
    });

    property('chain Failure', 'json', 'json -> json', (a, f) => {
      return _.chain(_.Failure(a), lift(f)).equals(_.Failure(a));
    });
  });

  describe('Functor', () => {
    property('map', 'json', 'json -> json', (a, f) => {
      return _.of(f(a)).equals(_.of(a).map(f))
    });
    
    property('Failure#map', 'json', 'json -> json', (a, f) => {
      return _.Failure(a).map(f).equals(_.Failure(a))
    });
  });

  describe('Applicative', () => {

    property('of', 'json', (a) => {
      return _.of(a).equals(_.Success(a))
    });
    property('Success#apply', 'string', 'string', 'string -> string -> string', (a, b, f) => {
      return _.Success(f)
                .apply(_.Success(a))
                .apply(_.Success(b))
                .equals(_.Success(f(a)(b)))
    });
    property('Success/Failure#apply', 'string', 'string','string -> string -> string', (a, b, f) => {
      return _.Success(f)
                .apply(_.Success(a))
                .apply(_.Failure(b))
                .equals(_.Failure(b))
    });
    property('Failure#apply', 'string', 'string','string -> string -> string', (a, b, f) => {
      return _.Success(f)
                .apply(_.Failure(a))
                .apply(_.Failure(b))
                .equals(_.Failure(a.concat(b)))
    });
  });

  describe('Semigroup', () => {
    property('Failure#concat', 'string', 'string', (a, b) => {
      return _.Failure(a).concat(_.Failure(b)).equals(_.Failure(a.concat(b)))
    });
    property('Success#concat', 'string', 'string', (a, b) => {
      return _.Success(a).concat(_.Success(b)).equals(_.Success(b))
    });
    property('Success/Failure#concat', 'string', 'string', (a, b, f) => {
      return _.Success(a).concat(_.Failure(b)).equals(_.Failure(b))
    });
  })

  describe('extracting/recovering', () => {
    property('Failure#getOrElse', 'json', 'json', (a, b) => {
      return _.Failure(b).getOrElse(a) === a
    });
    property('Success#getOrElse', 'json', 'json', (a, b) => {
      return _.Success(b).getOrElse(a) === b
    });

    property('Failure#orElse', 'json', 'json', (a, b) => {
      return _.Failure(b).orElse(() => a) === a
    });
    property('Success#orElse', 'json', 'json', (a, b) => {
      return _.Success(b).orElse(() => b).equals(_.Success(b))
    });
  });
  describe('folds', () => {
    const id = (a) => a
    property('Failure#fold', 'json', 'json -> json', (a, f) => {
      return _.Success(a).fold(id, f) === f(a)
    });
    property('Success#fold', 'json', 'json -> json', (a, f) => {
      return _.Failure(a).fold(f, id) === f(a)
    });

    property('Failure#merge', 'json', (a) => {
      return _.Success(a).merge() === a 
    });
    property('Success#merge', 'json', (a) => {
      return _.Failure(a).merge() === a 
    });

    property('Failure#swap', 'json', (a) => {
      return _.Failure(a).swap().equals(_.Success(a))
    });
    property('Success#swap', 'json', (a) => {
      return _.Success(a).swap().equals(_.Failure(a))
    });

    property('Success#bimap', 'json', 'json -> json', (a, f) => {
      return _.Success(a).bimap(id, f).equals(_.Success(f(a)))
    });
    property('Failure#bimap', 'json', 'json -> json', (a, f) => {
      return _.Failure(a).bimap(f, id).equals(_.Failure(f(a)))
    });

    property('Failure#mapFailure', 'json', 'json -> json', (a, f) => {
      return _.Failure(f(a)).equals(_.Failure(a).mapFailure(f))
    });
    
    property('Success#mapFailure', 'json', 'json -> json', (a, f) => {
      return _.Success(a).mapFailure(f).equals(_.Success(a))
    });
  });
  describe('Conversions', () => {
    property('Failure#fromNullable', 'string', (a) => {
        return _.fromNullable(null, a).equals(_.Failure(a))
        &&     _.fromNullable(undefined, a).equals(_.Failure(a));
    });

    property('Success#fromNullable', 'number | string | bool | dict nat | array nat', 'string', (a, b) => {
        return _.fromNullable(a, b).equals(_.Success(a))
    }); 
    property('Validation#fromResult', 'json', (a) => {
      return _.fromResult(_.Success(a).toResult()).equals(_.Success(a));
    });
    property('Success#fromMaybe', 'json', 'json', (a, b) => {
      return _.fromMaybe(_.Success(a).toMaybe(), b).equals(_.Success(a));
    });
    property('Failure#fromMaybe', 'json', 'json', (a, b) => {
      return _.fromMaybe(_.Failure(b).toMaybe(), b).equals(_.Failure(b));
    });
  });

  describe('Fantasy Land', () => {
    laws.Setoid(_.Failure);
    laws.Setoid(_.Success);

    laws.Semigroup(_.Failure);
    laws.Semigroup(_.Success);

    laws.Functor(_.Failure);
    laws.Functor(_.Success);

    // laws.Apply(_.Failure);  -- doesn't work because functions aren't semigroups
    laws.Apply(_.Success);

    laws.Applicative(_.Failure);
    laws.Applicative(_.Success);

    laws.Bifunctor((a, b) => _.Failure(a));
    laws.Bifunctor((a, b) => _.Success(b));
  });
});
