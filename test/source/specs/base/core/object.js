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
const _ = require('folktale/core/object');


const uniq = (xs) => [...new Set(xs)];


describe('Core.Object', () => {
  describe('toPairs(o)', () => {
    property('returns (key, value) pairs in the object', 'dict nat', (a) =>
      _.toPairs(a).every(([k, v]) => a[k] === v)
    );

    property('ignores inherited properties', 'dict nat', 'dict nat', (a, b) => {
      b = { ...b };
      Object.keys(a).forEach(k => delete b[k]);
      const c = Object.assign(Object.create(a), b);
      return _.toPairs(c).every(([k, v]) => b[k] === v && !(k in a));
    });

    property('ignores non-enumerable properties', 'dict string', 'string', (a, b) => {
      a = { ...a };
      Object.defineProperty(a, b, { value: b, enumerable: false });
      return _.toPairs(a).every(([k, _]) => k !== b);
    });
  });

  describe('fromPairs(ps)', () => {
    property('object should have all properties in the array', 'array (string & nat)', (ps) => {
      const o = _.fromPairs(ps);
      return Object.getOwnPropertyNames(o).every(k => ps.some(([k2, _]) => k === k2))
    });

    it('should not invoke setters in Object.prototype', () => {
      let invoked = false;
      Object.defineProperty(Object.prototype, '__ft_setter', { configurable: true, set(v){ invoked = true }});
      const o = _.fromPairs([['__ft_setter', 1]]);
      delete Object.prototype.__ft_setter;

      $ASSERT(!invoked && o['__ft_setter'] === 1);
    });

    it('should keep rightmost properties', () => {
      $ASSERT(_.fromPairs([['a', 1], ['a', 2]]).a === 2);
    });
  });

  // This is only true in an ES6 VM, so we don't run it outside of Node
  if (!process.browser) {
    property('fromPairs(toPairs(o)) = o', 'dict nat', (o) => {
      $ASSERT(_.fromPairs(_.toPairs(o)) == o);
      return true
    });
  }

  describe('values(o)', () => {
    property('returns an array of values in the object', 'array nat', (ns) => {
      ns = uniq(ns);
      const pairs = ns.map(x => [x, x]);
      $ASSERT(_.values(_.fromPairs(pairs)).sort() == ns.sort());
      return true
    });

    it('should skip inherited properties', () => {
      const a = { x: 1 };
      const b = Object.assign(Object.create(a), { y: 2 });
      $ASSERT(_.values(b) == [2]);
    });

    it('should skip non-enumerable properties', () => {
      const a = { x: 1 };
      Object.defineProperty(a, 'y', { value: 2, enumerable: false });
      $ASSERT(_.values(a) == [1]);
    });
  });

  describe('mapValues(o, f)', () => {
    property('returns an object with the same keys', 'dict nat', 'nat -> nat', (a, f) => {
      $ASSERT(Object.keys(a).sort() == Object.keys(_.mapValues(a, f)).sort());
      return true
    });

    property('Acts as identity with f = identity', 'dict nat', (a) => {
      $ASSERT(a == _.mapValues(a, x => x));
      return true
    });

    property('Has values transformed by f', 'dict nat', 'nat -> nat', (a, f) => {
      const b = _.mapValues(a, f);
      Object.keys(a).forEach(k => $ASSERT(b[k] == f(a[k])));
      return true
    });

    property('= o::mapValues(f)', 'dict nat', 'nat -> nat', (a, f) => {
      $ASSERT(_.mapValues(a, f) == a::_.mapValues.infix(f));
      return true
    });
  });

  describe('mapEntries(o, f, define)', () => {
    property('returns what define returns', 'dict nat', (a) => {
      $ASSERT(_.mapEntries(a, ([k, v]) => [k, v], (o, k, v) => ({ ...o, [k]: v })) == a);
      return true
    });

    property('transforms key and value by f', 'dict nat', 'string -> string', 'nat -> nat', (a, f, g) => {
      let ok = true;
      _.mapEntries(a, ([k, v]) => [[k, f(k)], [v, g(v)]], (o, [k, k2], [v, v2]) => {
        ok = (k2 === f(k)) && (v2 === g(v));
      });
      return ok
    });

    describe('mapEntries.overwrite(o, f)', () => {
      property('= mapEntries without duplicates', 'dict nat', 'nat -> nat', (a, f) => {
        $ASSERT(
           _.mapEntries.overwrite(a, ([k, v]) => [k, f(v)])
        == _.mapEntries(a, ([k, v]) => [k, f(v)], (o, k, v) => ({ ...o, [k]: v }))
        );
        return true
      });

      it('Overwrites duplicated properties', () => {
        $ASSERT(
           _.mapEntries.overwrite({ a: 1, b: 2, B: 3 }, ([k, v]) => [k.toLowerCase(), v])
        == { a: 1, b: 3 }
        );
      });
    });

    describe('mapEntries.unique(o, f)', () => {
     property('= mapEntries without duplicates', 'dict nat', 'nat -> nat', (a, f) => {
        $ASSERT(
           _.mapEntries.unique(a, ([k, v]) => [k, f(v)])
        == _.mapEntries(a, ([k, v]) => [k, f(v)], (o, k, v) => ({ ...o, [k]: v }))
        );
        return true
      });

      it('Throws an error with duplicated properties', () => {
        assert.throws(() => {
          _.mapEntries.unique({ a: 1, b: 2, B: 3 }, ([k, v]) => [k.toLowerCase(), v]);
        }, /The property b already exists in the resulting object\./);
      });
    });
  });
});