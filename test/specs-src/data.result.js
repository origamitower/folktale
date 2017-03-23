//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

const { property, forall} = require('jsverify');
const _ = require('folktale/data/result');
const laws = require('../helpers/fantasy-land-laws');


describe('Data.Result', function() {

  describe('constructors', () => {
    property('try#Error', 'json', (a) => {
        return _.try(() => {throw a }).equals(_.Error(a))
    });

    property('try#Ok', 'json', (a) => {
        return _.try(() => (a)).equals(_.Ok(a))
    }); 
  });

  describe('Functor', () => {
    property('map', 'json', 'json -> json', (a, f) => {
      return _.of(f(a)).equals(_.of(a).map(f))
    });
    
    property('Error#map', 'json', 'json -> json', (a, f) => {
      return _.Error(a).map(f).equals(_.Error(a))
    });
  });

  describe('Applicative', () => {
    property('of', 'json', (a) => {
      return _.of(a).equals(_.Ok(a))
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

    property('Error#chain', 'json', 'json -> json', (a, f) => {
      return _.Error(a).chain(lift(f)).equals(_.Error(a))
    });
  });

  describe('extracting/recovering', () => {
    property('Error#getOrElse', 'json', 'json', (a, b) => {
      return _.Error(b).getOrElse(a) === a
    });
    property('Ok#getOrElse', 'json', 'json', (a, b) => {
      return _.Ok(b).getOrElse(a) === b
    });

    property('Error#orElse', 'json', 'json', (a, b) => {
      return _.Error(b).orElse(() => a) === a
    });
    property('Ok#orElse', 'json', 'json', (a, b) => {
      return _.Ok(b).orElse(() => b).equals(_.Ok(b))
    });
  });
  describe('folds', () => {
    const id = (a) => a
    property('Error#fold', 'json', 'json -> json', (a, f) => {
      return _.Error(a).fold(f, id) === f(a)
    });
    property('Ok#fold', 'json', 'json -> json', (a, f) => {
      return _.Ok(a).fold(id, f) === f(a)
    });

    property('Error#merge', 'json', (a) => {
      return _.Error(a).merge() === a 
    });
    property('Ok#merge', 'json', (a) => {
      return _.Ok(a).merge() === a 
    });

    property('Error#swap', 'json', (a) => {
      return _.Error(a).swap().equals(_.Ok(a))
    });
    property('Ok#swap', 'json', (a) => {
      return _.Ok(a).swap().equals(_.Error(a))
    });

    property('Error#bimap', 'json', 'json -> json', (a, f) => {
      return _.Error(a).bimap(f, id).equals(_.Error(f(a)))
    });
    property('Ok#bimap', 'json', 'json -> json', (a, f) => {
      return _.Ok(a).bimap(id, f).equals(_.Ok(f(a)))
    });

    property('Error#mapError', 'json', 'json -> json', (a, f) => {
      return _.Error(f(a)).equals(_.Error(a).mapError(f))
    });
    
    property('Ok#mapError', 'json', 'json -> json', (a, f) => {
      return _.Ok(a).mapError(f).equals(_.Ok(a))
    });
  });
  describe('Conversions', () => {
    property('Error#fromNullable', () => {
      return _.fromNullable(null).equals(_.Error(null))
      &&     _.fromNullable(undefined).equals(_.Error(undefined));
    });

    property('Ok#fromNullable', 'number | string | bool | dict nat | array nat', (a) => {
      return _.fromNullable(a).equals(_.Ok(a));
    });
    property('Result#fromValidation', 'json', (a) => {
      return _.fromValidation(_.Error(a).toValidation()).equals(_.Error(a));
    });
    property('Error#fromMaybe', 'string', 'string', (a, b) => {
      return _.fromMaybe(_.Error(b).toMaybe(), b).equals(_.Error(b));
    });
    property('Ok#fromMaybe', 'json', 'json', (a, b) => {
      return _.fromMaybe(_.Ok(a).toMaybe(), b).equals(_.Ok(a));
    });
  });

  describe('Fantasy Land', () => {
    laws.Setoid(_.Error);
    laws.Setoid(_.Ok);

    laws.Functor(_.Error);
    laws.Functor(_.Ok);

    laws.Apply(_.Error);
    laws.Apply(_.Ok);

    laws.Applicative(_.Error);
    laws.Applicative(_.Ok);

    laws.Chain(_.Error);
    laws.Chain(_.Ok);

    laws.Monad(_.Error);
    laws.Monad(_.Ok);

    laws.Bifunctor((a, b) => _.Error(a));
    laws.Bifunctor((a, b) => _.Ok(b));
  });
});
