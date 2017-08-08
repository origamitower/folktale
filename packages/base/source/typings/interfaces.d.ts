//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

export interface Setoid<A> {
  equals(this: Setoid<A>, that: Setoid<A>): boolean
}

export interface Semigroup<A> {
  concat(this: Semigroup<A>, that: Semigroup<A>): Semigroup<A>
}

export interface Monoid<A> extends Semigroup<A> {
  empty(this: Monoid<A>): Monoid<A>
}

export interface Functor<A> {
  map<B>(this: Functor<A>, transformation: (_: A) => B): Functor<B>
}

export interface Applicative<A> extends Functor<A> {
  apply<B>(this: Applicative<(_: A) => B>, that: Applicative<A>): Applicative<B>
  of<B>(this: Applicative<A>, value: B): Applicative<B>
}

export interface Foldable<A> {
  reduce<A, B>(this: Foldable<A>, combinator: (acc: B, item: A) => B, initial: B): B
}

export interface Traverse<A> extends Functor<A>, Foldable<A> {
  traverse<A, B>(this: Traverse<A>, type: Applicative<B>, lift: (_: A) => Applicative<B>): Applicative<Traverse<B>>
}

export interface Chain<A> {
  chain<B>(this: Chain<A>, transformation: (_: A) => Chain<B>): Chain<B>
}

export interface ChainRec<A> {
  chainRecursively<A, B, C>(
    this: ChainRec<A>,
    step: (next: F1<A, C>, done: F1<B, C>, value: A) => ChainRec<C>,
    initial: A
  ): ChainRec<B>
}

export interface Monad<A> extends Applicative<A>, Chain<A> { }

export interface Extend<A> {
  extend<B>(this: Extend<A>, transformation: (_: Extend<A>) => B): Extend<B>
}

export interface Comonad<A> extends Extend<A> {
  extract(this: Comonad<A>): A
}

export interface Bifunctor<A, B> {
  bimap<C, D>(this: Bifunctor<A, B>, f: (_: A) => C, g: (_: B) => D): Bifunctor<C, D>
}

export interface Profunctor<A, B> {
  promap<C, D>(this: Profunctor<A, B>, f: (_: C) => A, g: (_: B) => D): Profunctor<C, D>
}

