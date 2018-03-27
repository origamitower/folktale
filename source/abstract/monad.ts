/*
----------------------------------------------------------------------

 This source file is part of the Folktale project.

 Licensed under MIT. See LICENCE for full licence information.
 See CONTRIBUTORS for the list of contributors to the project.

----------------------------------------------------------------------
*/

import {Applicative, StaticApplicative} from './applicative';

export abstract class Monad<A> extends Applicative<A> {
    /* This is defined in Applicative, but we introduced more stringent typing: */
    abstract map<B>(fn: (_: A) => B): Monad<B>;
    /* This is required to meet the monad spec: */
    abstract chain<B>(_: (_: A) => Monad<B>): Monad<B>;
    /* Derived methods: */
    apply<B, C>(this: Monad<(_: B) => C>, x: Monad<B>): Monad<C> {
        return this.chain((apfn) => x.map(apfn));
    }
    bind<B>(fn: (_: A) => Monad<B>): Monad<B> {
        return this.chain(fn);
    }
    flatMap<B>(fn: (_: A) => Monad<B>): Monad<B> {
        return this.chain(fn);
    }
}

export interface StaticMonad<A> extends StaticApplicative<A> {
    of(_: A): Monad<A>
}
