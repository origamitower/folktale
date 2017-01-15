//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

const { property } = require('jsverify');
const assert = require('assert');
const _ = require('folktale/core/lambda');

const eqPairs = (...xs) =>
        xs.reduce((p, x) =>
                  p.r && (!('v' in p) || p.v === x)?  { r: true, v: x }
                  : /* otherwise */  { r: false },
                  { r: true }).r;


describe('Core.Lambda', () => {
  describe('compose(f, g)', () => {
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


  describe('constant(a)()', () => {
    property('= a', 'nat', (a) => {
      return _.constant(a)() === a;
    });
  });


  describe('identity(a)', () => {
    property('= a', 'nat', (a) => {
      return _.identity(a) === a;
    });
  });


  describe('curry(arity, fn)', () => {
    const f = (a, b) => a(b);
    const g = (a) => a + 1;
    const h = (a) => (b) => a(b) + 1;
    const i = (a, b, c, d) => a + b + c + d;

    it('invoking with fewer arguments yields a new function that takes the rest', () => {
      $ASSERT(typeof _.curry(2, f)(g) == 'function');
      $ASSERT(_.curry(2, f)(g)(1) == 2);
    });

    it('invoking with the correct number of arguments invokes the underlying operation', () => {
      $ASSERT(_.curry(2, f)(g, 1) == 2);
    });

    it('invoking with more arguments passes the remaining arguments to the result of the operation', () => {
      $ASSERT(_.curry(2, f)(h, g)(1) == 3);
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

  describe('partialise(arity, f)', () => {
    const f = (a, b, c) => a - b - c;
    const $ = _.partialise.hole;

    it('invoking with the less arguments than the arity is an error', () => {
      assert.throws(_ => { _.partialise(3, f)(1, 2) });
    });

    property('providing a hole creates a new partially specified function', 'nat', 'nat', 'nat', (a, b, c) =>
       _.partialise(3, f)($, b, c)(a) === f(a, b, c)
    && _.partialise(3, f)(a, $, c)(b) === f(a, b, c)
    && _.partialise(3, f)(a, b, $)(c) === f(a, b, c)
    );

    property('multiple holes may be provided', 'nat', 'nat', 'nat', (a, b, c) =>
       _.partialise(3, f)($, $, c)(a, b) === f(a, b, c)
    && _.partialise(3, f)(a, $, $)(b, c) === f(a, b, c)
    && _.partialise(3, f)($, b, $)(a, c) === f(a, b, c)
    );

    property('returned partial functions are partialised themselves', 'nat', 'nat', 'nat', (a, b, c) =>
       _.partialise(3, f)($, $, c)($, b)(a) === f(a, b, c)
    && _.partialise(3, f)(a, $, $)($, c)(b) === f(a, b, c)
    && _.partialise(3, f)($, b, $)(a, $)(c) === f(a, b, c)
    );

    property('all arguments may be holes, which doen’t change the function', 'nat', 'nat', 'nat', (a, b, c) =>
      _.partialise(3, f)($, $, $)(a, b, c) === f(a, b, c)
    );
  });
});
