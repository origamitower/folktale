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
const env = require('./environment');
const _ = require('folktale/core/fantasy-land/curried');

describe('core.fantasyLand', function() {

  describe('curried', function() {

    property('apply', 'applicative (json -> json)', 'applicative json', env, function(mf, ma) {
      return _.apply(mf)(ma).equals(ma['fantasy-land/ap'](mf))
    })

    property('concat', 'semigroup string', 'semigroup string', env, function(a, b)  {
      return _.concat(b)(a).equals((a['fantasy-land/concat'](b)))
    });

    property('chain', 'json -> monad json', 'monad json', env, function(mf, ma) {
      return _.chain(mf)(ma).equals(ma['fantasy-land/chain'](mf))
    });

    property('empty', 'monoid string', env, (m) => {
      return _.empty(m).equals(m['fantasy-land/empty']());
    });

    property('map', 'json -> json', 'functor json', env, function(f, ma) {
      return _.map(f)(ma).equals(ma['fantasy-land/map'](f))
    });

    property('of', 'json', 'functor json', env, function(a, ma) {
      return _.of(ma)(a).equals(ma['fantasy-land/of'](a))
    });

    property('equals', 'functor json', 'functor json', env, function(a, b) {
      return _.equals(b)(a) === a['fantasy-land/equals'](b)
    });
    property('bimap', 'bifunctor json', 'json -> json', 'json -> json', env, function(a, f, g) {
      return _.bimap(f, g)(a).equals(a['fantasy-land/bimap'](f, g))
    });
  });

})
