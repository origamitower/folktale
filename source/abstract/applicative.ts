/*
----------------------------------------------------------------------

 This source file is part of the Folktale project.

 Licensed under MIT. See LICENCE for full licence information.
 See CONTRIBUTORS for the list of contributors to the project.

----------------------------------------------------------------------
*/

import { Functor } from './functor';
import {Monad} from './monad';

export abstract class Applicative<A> extends Functor<A> {
    /* This is defined in Functor, but we introduced more stringent typing: */
    abstract map<B>(fn: (_: A) => B): Applicative<B>;
    /* This is required to meet the applicative spec: */
    abstract apply<B, C>(this: Applicative<(_: B) => C>, x: Applicative<B>): Applicative<C>;
    /* Derived methods: */
    ap<C>(apfn: Applicative<(_: A) => C>): Applicative<C> {
        return apfn.apply(this);
    }
}

export interface StaticApplicative<A> {
    of(_: A): Applicative<A>
}
