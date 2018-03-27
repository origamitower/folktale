/*
----------------------------------------------------------------------

 This source file is part of the Folktale project.

 Licensed under MIT. See LICENCE for full licence information.
 See CONTRIBUTORS for the list of contributors to the project.

----------------------------------------------------------------------
*/

import {Monad, StaticMonad} from '../abstract/monad';
import {staticImplements} from '../decorators/staticImplements';
import {HasTypeAndTag, tagSymbol, typeSymbol} from '../abstract/symbols';
import {deriveStandardMethods} from '../decorators/standardDerivations';
import {Semigroup} from '../abstract/semigroup';
import {assertType} from '../helpers/assert-type';
import { of as flOfSymbol } from '../helpers/fantasy-land';

const assertFunction = require('folktale/helpers/assert-function');

type MaybeType = 'Maybe';
type MaybeTags = 'Just' | 'Nothing';

@staticImplements<StaticMonad<Maybe<any>>>()
export abstract class Maybe<A> extends Monad<A> implements HasTypeAndTag {
    static get [typeSymbol](): MaybeType {
        return 'Maybe';
    }
    static get [tagSymbol](): MaybeTags {
        throw new Error(`${tagSymbol} is not implemented in abstract class Maybe.`);
    }

    /* These all are defined in Functor and Applicative: */
    abstract map<B>(fn: (_:A) => B): Maybe<B>;
    abstract chain<B>(_: (_: A) => Maybe<B>): Maybe<B>;
    abstract getOrElse(_default: A): A;
    abstract orElse(f: () => Maybe<A>): Maybe<A>;
    abstract concat<S extends Semigroup<A>>(this: Maybe<S>, x: Maybe<S>): Maybe<S>;
    abstract filter(f: (_: A) => boolean): Maybe<A>;
    abstract unsafeGet(): A;
    abstract fold<B>(onNothing: () => B, onJust: (_: A) => B): B;
    static of<A>(value: A): Just<A> {
        return new Just(value);
    }
    static empty<A>(): Nothing<A> {
        return new Nothing<A>();
    }

    /* Derived methods: */
    static Just<A>(value: A): Just<A> {
        return Maybe.of(value);
    }
    static Nothing<A>(): Nothing<A> {
        return Maybe.empty();
    }
    static [flOfSymbol]<A>(value: A): Just<A> {
        return Maybe.of(value);
    }

    /* These will be overriden in the subclasses by decorators */
    equals(that: Maybe<A>): boolean{
        return false;
    }
    matchWith<B>(pattern: {[k: string]: (_: any) => B}): B {
        throw new Error(`matchWith is not implemented in abstract class Maybe.`);
    }
    static inspect(): string{
        throw new Error(`inspect is not implemented in abstract class Maybe.`);
    }
    static toString(): string{
        throw new Error(`toString is not implemented in abstract class Maybe.`);
    }

    /* ToDo: We need to implement these: */
    // toResult<B>(fallback: B): Result<B, A>;
    // toValidation<B>(fallback: B): Validation<B, A>;

}

export const just = Maybe.of;
export const nothing = Maybe.empty;

const assertMaybe = assertType(Maybe);

@deriveStandardMethods
class Just<A> extends Maybe<A> {
    static get [tagSymbol](): string {
        return 'Just';
    }
    constructor(private value:A){
        super();
    }
    map<B>(fn: (_:A) => B): Just<B> {
        assertFunction('Maybe.Just#map', fn);
        return Maybe.of(fn(this.value));
    }
    chain<B>(fn: (_: A) => Maybe<B>): Maybe<B> {
        assertFunction('Maybe.Just#chain', fn);
        return fn(this.value);
    }
    unsafeGet(): A {
        return this.value;
    }
    getOrElse(_default: A): A {
        return this.value;
    }
    orElse(handler: () => Maybe<A>): Just<A> {
        assertFunction('Maybe.Just#orElse', handler);
        return this;
    }
    concat<S extends Semigroup<A>>(this: Maybe<S>, y: Maybe<S>): Maybe<S> {
        assertMaybe('Maybe.Just#concat', y);
        const x = this.unsafeGet() as S;
        return y.matchWith({
            Nothing: (_) => this as Just<S>,
            Just: (a) => Maybe.of<S>(x.concat(a.unsafeGet() as S) as S) as Maybe<S>
        });
    }
    fold<B>(onNothing: () => B, onJust: (_: A) => B): B {
        assertFunction('Maybe.Just#fold', onNothing);
        assertFunction('Maybe.Just#fold', onJust);
        return onJust(this.value);
    }
    filter(predicate: (_: A) => boolean): Maybe<A> {
        assertFunction('Maybe.Just#filter', predicate);
        return predicate(this.value) ? this : Maybe.empty<A>();
    }
}

@deriveStandardMethods
class Nothing<A> extends Maybe<A>{
    static get [tagSymbol](): string {
        return 'Nothing';
    }
    constructor(){
        super();
    }
    map<B>(fn: (_:A) => B): Nothing<B> {
        assertFunction('Maybe.Nothing#map', fn);
        return Maybe.empty<B>();
    }
    chain<B>(fn: (_: A) => Maybe<B>): Nothing<B> {
        assertFunction('Maybe.Nothing#chain', fn);
        return Maybe.empty<B>();
    }
    unsafeGet(): A {
        throw new TypeError(`Can't extract the value of a Nothing.

    Since Nothing holds no values, it's not possible to extract one from them.
    You might consider switching from Maybe#get to Maybe#getOrElse, or some other method
    that is not partial.
      `);
    }
    getOrElse(_default: A): A {
        return _default;
    }
    orElse(handler: () => Maybe<A>): Maybe<A> {
        assertFunction('Maybe.Nothing#orElse', handler);
        return handler();
    }
    concat<S extends Semigroup<A>>(this: Maybe<S>, y: Maybe<S>) {
        assertMaybe('Maybe.Nothing#concat', y);
        return y;
    }
    fold<B>(onNothing: () => B, onJust: (_: A) => B): B {
        assertFunction('Maybe.Nothing#fold', onNothing);
        assertFunction('Maybe.Nothing#fold', onJust);
        return onNothing();
    }
    filter(predicate: (_: A) => boolean): Nothing<A> {
        assertFunction('Maybe.Nothing#filter', predicate);
        return Maybe.empty<A>();
    }
}
