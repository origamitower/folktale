//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// See LICENCE for licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------


const aliases = {
  equals: {
    /*
     * Fantasy Land's Setoid `equals'.
     * ---
     * category: Fantasy Land
     * type: |
     *   ('S 'a).('S 'a) => Boolean
     *   where 'S is Setoid
     */
    'fantasy-land/equals'(that) {
      return this.equals(that);
    }
  },

  concat: {
    /*
     * Fantasy Land's Semigroup `concat`.
     * ---
     * category: Fantasy Land
     * type: |
     *   ('S 'a).('S 'a) => 'S 'a
     *   where 'S is Semigroup
     */
    'fantasy-land/concat'(that) {
      return this.concat(that);
    }
  },

  empty: {
    /*
     * Fnatasy Land's Monoid `empty`.
     * ---
     * category: Fantasy Land
     * type: |
     *   ('M).() => 'M a
     *   where 'M is Monoid
     */
    'fantasy-land/empty'() {
      return this.empty();
    }
  },

  map: {
    /*
     * Fantasy Land's Functor `map`.
     * ---
     * category: Fantasy Land
     * type: |
     *   ('F 'a).(('a) => 'b) => 'F 'b
     *   where 'F is Functor
     */
    'fantasy-land/map'(transformation) {
      return this.map(transformation);
    }
  },

  apply: {
    /*
     * Fantasy Land's Apply `ap`
     * ---
     * category: Fantasy Land
     * type: |
     *   ('F ('a) => b).('F 'a) => 'F 'b
     *   where 'F is Apply
     */
    ap(that) {
      return this.apply(that);
    },

    /*
     * Fantasy Land's Apply `ap`
     * ---
     * category: Fantasy Land
     * type: |
     *   ('F 'a).('F ('a) => 'b) => 'F 'b
     *   where 'F is Apply
     */
    'fantasy-land/ap'(that) {
      return that.apply(this);
    }
  },

  of: {
    /*
     * Fantasy Land's Applicative `of`
     * ---
     * category: Fantasy Land
     * type: |
     *   forall F, a:
     *     (F).(a) => F a
     *   where F is Applicative 
     */
    'fantasy-land/of'(value) {
      return this.of(value);
    }
  },

  reduce: {
    /*
     * Fantasy Land’s Foldable `reduce`.
     * ---
     * category: Fantasy Land
     * type: |
     *   forall F, a, b:
     *     (F a).((b, a) => b, b) => b
     *   where F is Foldable  
     */
    'fantasy-land/reduce'(combinator, initial) {
      return this.reduce(combinator, initial);
    }
  },

  traverse: {
    /*
     * Fantasy Land’s Traversable `traverse`.
     * ---
     * category: Fantasy Land
     * type: |
     *   forall F, T, a, b:
     *     (T a).((a) => F b, (c) => F c) => F (T b)
     *   where F is Apply, T is Traversable
     */
    'fantasy-land/traverse'(transformation, lift) {
      return this.traverse(transformation, lift);
    }
  },

  chain: {
    /*
     * Fantasy Land’s Chain `chain`.
     * ---
     * category: Fantasy Land
     * type: |
     *   forall M, a, b:
     *     (M a).((a) => M b) => M b
     *   where M is Chain
     */
    'fantasy-land/chain'(transformation) {
      return this.chain(transformation);
    }
  },

  chainRecursively: {
    /*
     * Fantasy Land’s ChainRec `chainRec`.
     * ---
     * category: Fantasy Land
     * type: |
     *   forall M, a, b, c:
     *     (M).(
     *       Step:    ((a) => c, (b) => c, a) => M c,
     *       Initial: a
     *     ) => M b
     *   where M is ChainRec 
     */
    chainRec(step, initial) {
      return this.chainRecursively(step, initial);
    },

    /*
     * Fantasy Land’s ChainRec `chainRec`.
     * ---
     * category: Fantasy Land
     * type: |
     *   forall M, a, b, c:
     *     (M).(
     *       Step:    ((a) => c, (b) => c, a) => M c,
     *       Initial: a
     *     ) => M b
     *   where M is ChainRec 
     */
    'fantasy-land/chainRec'(step, initial) {
      return this.chainRecursively(step, initial);
    }
  },

  extend: {
    /*
     * Fantasy Land’s Extend `extend`
     * ---
     * category: Fantasy Land
     * type: |
     *   forall W, a, b:
     *     (W a).((W a) => b) => W b
     *   where W is Extend
     */
    'fantasy-land/extend'(transformation) {
      return this.extend(transformation);
    }
  },

  extract: {
    /*
     * Fantasy Land’s Comonad `extract`
     * ---
     * category: Fantasy Land
     * type: |
     *   forall W, a, b:
     *     (W a).() => a
     *   where W is Comonad
     */
    'fantasy-land/extract'() {
      return this.extract();
    }
  },

  bimap: {
    /*
     * Fantasy Land’s Bifunctor `bimap`
     * ---
     * category: Fantasy Land
     * type: |
     *   forall F, a, b, c, d:
     *     (F a b).((a) => c, (b) => d) => F c d
     *   where F is Bifunctor
     */
    'fantasy-land/bimap'(f, g) {
      return this.bimap(f, g);
    }
  },

  promap: {
    /*
     * Fantasy Land’s Profunctor `promap`
     * ---
     * category: Fantasy Land
     * type: |
     *   forall P, a, b, c, d:
     *     (P a b).((c) => a, (b) => d) => P c d
     */
    'fantasy-land/promap'(f, g) {
      return this.promap(f, g);
    }
  }
};


const provideAliases = (structure) => {
  Object.keys(aliases).forEach(method => {
    if (typeof structure[method] === 'function') {
      Object.keys(aliases[method]).forEach(alias => {
        structure[alias] = aliases[method][alias];
      });
    }
  });
};


module.exports = provideAliases;
