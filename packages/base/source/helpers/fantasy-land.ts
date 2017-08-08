//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

import * as FL from '../typings/interfaces'

const aliases = {
  equals: {
    'fantasy-land/equals'<A>(this: FL.Setoid<A>, that: FL.Setoid<A>): boolean {
      return this.equals(that);
    }
  },

  concat: {
    'fantasy-land/concat'<A>(this: FL.Semigroup<A>, that: FL.Semigroup<A>): FL.Semigroup<A> {
      return this.concat(that);
    }
  },

  empty: {
    'fantasy-land/empty'<A>(this: FL.Monoid<A>): FL.Monoid<A> {
      return this.empty();
    }
  },

  map: {
    'fantasy-land/map'<A, B>(this: FL.Functor<A>, transformation: (_: A) => B): FL.Functor<B> {
      return this.map(transformation);
    }
  },

  apply: {
    ap<A, B>(this: FL.Applicative<(_: A) => B>, that: FL.Applicative<A>): FL.Applicative<B> {
      return this.apply(that);
    },

    'fantasy-land/apply'<A, B>(this: FL.Applicative<A>, that: FL.Applicative<(_: A) => B>): FL.Applicative<B> {
      return that.apply(this);
    }
  },

  of: {
    'fantasy-land/of'<A, B>(this: FL.Applicative<A>, value: B): FL.Applicative<B> {
      return this.of(value);
    }
  },

  reduce: {
    'fantasy-land/reduce'<A, B>(this: FL.Foldable<A>, combinator: F2<B, A, B>, initial: B): B {
      return this.reduce(combinator, initial);
    }
  },

  traverse: {
    'fantasy-land/traverse'<A, B>(this: FL.Traverse<A>, type: FL.Applicative<B>, lift: F1<A, FL.Applicative<B>>): FL.Applicative<FL.Traverse<B>> {
      return this.traverse(type, lift);
    }
  },

  chain: {
    'fantasy-land/chain'<A, B>(this: FL.Chain<A>, transformation: F1<A, FL.Chain<B>>): FL.Chain<B> {
      return this.chain(transformation);
    }
  },

  chainRecursively: {
    chainRec<A, B, C>(
      this: FL.ChainRec<A>,
      step: (next: F1<A, C>, done: F1<B, C>, value: A) => FL.ChainRec<C>,
      initial: A
    ): FL.ChainRec<B> {
      return this.chainRecursively(step, initial);
    },

    'fantasy-land/chainRec'<A, B, C>(
      this: FL.ChainRec<A>,
      step: (next: F1<A, C>, done: F1<B, C>, value: A) => FL.ChainRec<C>,
      initial: A
    ): FL.ChainRec<B> {
      return this.chainRecursively(step, initial);
    },
  },

  extend: {
    'fantasy-land/extend'<A, B>(this: FL.Extend<A>, transformation: F1<FL.Extend<A>, B>): FL.Extend<B> {
      return this.extend(transformation);
    }
  },

  extract: {
    'fantasy-land/extract'<A>(this: FL.Comonad<A>): A {
      return this.extract();
    }
  },

  bimap: {
    'fantasy-land/bimap'<A, B, C, D>(this: FL.Bifunctor<A, B>, f: F1<A, C>, g: F1<B, D>): FL.Bifunctor<C, D> {
      return this.bimap(f, g);
    }
  },

  promap: {
    'fantasy-land/promap'<A, B, C, D>(this: FL.Profunctor<A, B>, f: F1<C, A>, g: F1<B, D>): FL.Profunctor<C, D> {
      return this.promap(f, g);
    }
  }
}


export function withFantasyLand(type: any) {
  const copyMethod = (to: any, method: string) => {
    Object.keys((aliases as any)[method]).forEach(alias => {
      to[alias] = (aliases as any)[method][alias];
    });
  }

  Object.keys(aliases).forEach(method => {
    if (typeof type[method] === 'function') {
      copyMethod(type, method);
    }
    if (typeof type.prototype[method] === 'function') {
      copyMethod(type.prototype, method);
    }
  });
}
