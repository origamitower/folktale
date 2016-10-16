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
      return _.apply(mf)(ma).equals(mf.ap(ma))
    })

    property('concat', 'string', 'string', function(a, b)  {
      return _.concat(b)(a) === (a.concat(b))
    });

    property('chain', 'json -> monad json', 'monad json', env, function(mf, ma) {
      return _.chain(mf)(ma).equals(ma.chain(mf))
    });

    it('empty', function() {
      var mock = { empty(){ return 1} }
      assert(_.empty(mock) === mock.empty());
    });

    property('map', 'json -> json', 'functor json', env, function(f, ma) {
      return _.map(f)(ma).equals(ma.map(f))
    });

    property('of', 'json', 'functor json', env, function(a, ma) {
      return _.of(ma)(a).equals(ma.of(a))
    });

    property('equals', 'functor json', 'functor json', env, function(a, b) {
      return _.equals(b)(a) === a.equals(b)
    });
    property('bimap', 'bifunctor json', 'json -> json', 'json -> json', env, function(a, f, g) {
      return _.bimap(f, g)(a).equals(a.bimap(f, g))
    });
  });

})
