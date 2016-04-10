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

const { property } = require('jsverify');
const assert = require('assert');
const _ = require('../').core.lambda;

const eqPairs = (...xs) =>
        xs.reduce((p, x) =>
                  p.r && (!('v' in p) || p.v === x)?  { r: true, v: x }
                  : /* otherwise */  { r: false },
                  { r: true }).r;

describe('Core.Lambda', function() {
  describe('compose(f, g)', function() {
    property('= f(g(x))', 'integer', (a) => {
      const f = (x) => x - 1;
      const g = (y) => y * 2;
      return _.compose(f, g)(a) === f(g(a));
    });

    property('Associativity: compose(f, compose(g, h)) = compose(compose(f, g), h)', 'integer', (a) => {
      const f = (x) => x - 1;
      const g = (x) => x * 2;
      const h = (x) => x / 3;
      return _.compose(f, _.compose(g, h))(a) === _.compose(_.compose(f, g), h)(a);
    });
  });

  describe('constant(a)()', function() {
    property('= a', 'nat', (a) => {
      return _.constant(a)() === a;
    });
  });

  describe('identity(a)', function() {
    property('= a', 'nat', (a) => {
      return _.identity(a) === a;
    });
  });

  describe('curry(arity, fn)', function() {
    const f = (a, b) => a(b);
    const g = (a) => a + 1;
    const h = (a) => (b) => a(b) + 1;
    const i = (a, b, c, d) => a + b + c + d;

    it('invoking with fewer arguments yields a new function that takes the rest', function() {
      assert.equal(typeof _.curry(2, f)(g), 'function');
      assert.equal(_.curry(2, f)(g)(1), 2);
    });

    it('invoking with the correct number of arguments invokes the underlying operation', function() {
      assert.equal(_.curry(2, f)(g, 1), 2);
    });

    it('invoking with more arguments passes the remaining arguments to the result of the operation', function() {
      assert.equal(_.curry(2, f)(h, g, 1), 3);
    });

    property('should support any kind of arguments grouping', 'nat & nat & nat & nat', ([a, b, c, d]) => {
      return eqPairs(
        _.curry(4, i)(a)(b)(c)(d),
        _.curry(4, i)(a, b, c, d),
        _.curry(4, i)(a, b, c)(d),
        _.curry(4, i)(a, b)(c, d),
        _.curry(4, i)(a)(b, c, d),
        _.curry(4, i)(a)(b, c)(d),
        _.curry(4, i)(a, b)(c)(d),
        _.curry(4, i)(a)(b)(c, d),
        a + b + c + d
      );
    });
  });
});
