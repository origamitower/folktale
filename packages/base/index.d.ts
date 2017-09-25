declare namespace folktale {
  // -- Core
  interface Lambda {
    compose<A, B, C>(f: (_: B) => C, g: (_: A) => B): (_: A) => C;
    constant<A, B>(value: A): (_: B) => A;
    identity<A>(value: A): A;
  }

  interface Object {
    fromPairs<A>(pairs: [string, A][]): { [key: string]: A};
    toPairs<A>(object: {[key: string]: A}): [string, A][];
    values<A>(object: {[key: string]: A}): A[];
    mapValues<A, B>(object: {[key: string]: A}, fn: (_: A) => B): {[key: string]: B};
  }

  interface Core {
    lambda: Lambda;
    object: Object;
  }

  // -- Maybe
  type Semigroup<A> = A & {
    concat(this: Semigroup<A>, that: Semigroup<A>): Semigroup<A>
  }

  type Maybe<A> = Just<A> | Nothing<A>

  interface Just<A> {
    __type: A;
    __tag: 'Just';
    value: A;
    map<B>(f: (_: A) => B): Maybe<B>;
    apply<B>(this: Maybe<(_: A) => B>, f: Maybe<A>): Maybe<B>;
    chain<B>(f: (_: A) => Maybe<B>): Maybe<B>;
    getOrElse(_default: A): A;
    orElse(f: (_: A) => Maybe<A>): Maybe<A>;
    concat<S extends Semigroup<A>>(this: Maybe<S>, x: Maybe<S>): Maybe<S>;
    filter(f: (_: A) => boolean): Maybe<A>;
    matchWith<R>(patterns: {
      Just(_: { value: A }): R
      Nothing(_: {}): R
    }): R;
    toResult<B>(fallback: B): Result<B, A>;
    toValidation<B>(fallback: B): Validation<B, A>;
  }

  interface Nothing<A> {
    __type: A;
    __tag: 'Nothing';
    map<B>(f: (_: A) => B): Maybe<B>;
    apply<B>(this: Maybe<(_: A) => B>, f: Maybe<A>): Maybe<B>;
    chain<B>(f: (_: A) => Maybe<B>): Maybe<B>;
    getOrElse(_default: A): A;
    orElse(f: () => Maybe<A>): Maybe<A>;
    concat<S extends Semigroup<A>>(this: Maybe<S>, x: Maybe<S>): Maybe<S>;
    filter(f: (_: A) => boolean): Maybe<A>;
    matchWith<R>(patterns: {
      Just(_: { value: A }): R
      Nothing(_: {}): R
    }): R;
    toResult<B>(fallback: B): Result<B, A>;
    toValidation<B>(fallback: B): Validation<B, A>;
  }

  interface StaticMaybe {
    of<A>(value: A): Maybe<A>;
    empty<A>(): Maybe<A>;
    Just<A>(value: A): Maybe<A>;
    Nothing<A>(): Maybe<A>;
    hasInstance(value: any): boolean;
    fromNullable<A>(_: A | null): Maybe<A>;
    fromResult<A, B>(_: Result<A, B>): Maybe<B>;
    fromValidation<A, B>(_: Validation<A, B>): Maybe<B>;
  }

  
  // -- Result
  type Result<A, B> = Error<A, B> | Ok<A, B>;

  interface Error<A, B> {
    __type0: A;
    __type1: B;
    __tag: 'Error';
    value: A;

    map<C>(f: (_: B) => C): Result<A, C>;
    apply<C>(this: Result<A, (_: B) => C>, that: Result<A, B>): Result<A, C>;
    chain<C>(f: (_: B) => Result<A, C>): Result<A, C>;
    getOrElse(_default: B): B;
    orElse(f: (_: A) => A): Result<A, B>;
    concat<S extends Semigroup<B>>(this: Result<A, S>, that: Result<A, S>): Result<A, S>;
    swap(): Result<B, A>;
    bimap<C, D>(error: (_: A) => C, ok: (_: B) => D): Result<C, D>;
    mapError<C>(f: (_: A) => C): Result<C, B>;
    filter(f: (_: B) => boolean): Result<A, B>;
    merge(): A | B;
    toValidation(): Validation<A, B>;
    toMaybe(): Maybe<B>;
  }

  interface Ok<A, B> {
    __type0: A;
    __type1: B;
    __tag: 'Ok';
    value: B;

    map<C>(f: (_: B) => C): Result<A, C>;
    apply<C>(this: Result<A, (_: B) => C>, that: Result<A, B>): Result<A, C>;
    chain<C>(f: (_: B) => Result<A, C>): Result<A, C>;
    getOrElse(_default: B): B;
    orElse(f: (_: A) => A): Result<A, B>;
    concat<S extends Semigroup<B>>(this: Result<A, S>, that: Result<A, S>): Result<A, S>;
    swap(): Result<B, A>;
    bimap<C, D>(error: (_: A) => C, ok: (_: B) => D): Result<C, D>;
    mapError<C>(f: (_: A) => C): Result<C, B>;
    filter(f: (_: B) => boolean): Result<A, B>;
    merge(): A | B;
    toValidation(): Validation<A, B>;
    toMaybe(): Maybe<B>;
  }

  interface StaticResult {
    Error<A, B>(value: A): Result<A, B>;
    Ok<A, B>(value: B): Result<A, B>;
    hasInstance(value: any): boolean;
    of<A, B>(value: B): Result<A, B>;
    try<A, B>(f: (() => B)): Result<A, B>;
    fromNullable<A, B>(value: B | null): Result<A, B>;
    fromValidation<A, B>(value: Validation<A, B>): Result<A, B>;
    fromMaybe<A, B>(value: Maybe<B>, failure: A): Result<A, B>;
  }


  // -- Validation
  type Validation<A, B> = Failure<A, B> | Success<A, B>;
  
  interface Failure<A, B> {
    __type0: A;
    __type1: B;
    __tag: 'Failure';
    value: A;

    map<C>(f: (_: B) => C): Validation<A, C>;
    apply<C>(this: Validation<A, (_: B) => C>, that: Validation<A, B>): Validation<A, C>;
    getOrElse(_default: B): B;
    orElse(f: (_: A) => A): Validation<A, B>;
    concat<S extends Semigroup<A>>(this: Validation<S, B>, that: Validation<S, B>): Validation<S, B>;
    swap(): Validation<B, A>;
    bimap<C, D>(error: (_: A) => C, ok: (_: B) => D): Validation<C, D>;
    mapFailure<C>(f: (_: A) => C): Validation<C, B>;
    filter(f: (_: B) => boolean): Validation<A, B>;
    merge(): A | B;
    toResult(): Result<A, B>;
    toMaybe(): Maybe<B>;
  }

  interface Success<A, B> {
    __type0: A;
    __type1: B;
    __tag: 'Success';
    value: B;

    map<C>(f: (_: B) => C): Validation<A, C>;
    apply<C>(this: Validation<A, (_: B) => C>, that: Validation<A, B>): Validation<A, C>;
    getOrElse(_default: B): B;
    orElse(f: (_: A) => A): Validation<A, B>;
    concat<S extends Semigroup<A>>(this: Validation<S, B>, that: Validation<S, B>): Validation<S, B>;
    swap(): Validation<B, A>;
    bimap<C, D>(error: (_: A) => C, ok: (_: B) => D): Validation<C, D>;
    mapFailure<C>(f: (_: A) => C): Validation<C, B>;
    filter(f: (_: B) => boolean): Validation<A, B>;
    merge(): A | B;
    toResult(): Result<A, B>;
    toMaybe(): Maybe<B>;
  }

  interface StaticValidation {
    Failure<A, B>(value: A): Validation<A, B>;
    Success<A, B>(value: B): Validation<A, B>;
    hasInstance(value: any): boolean;
    of<A, B>(value: B): Validation<A, B>;
    collect<A, B, S extends Semigroup<A>>(validations: Validation<S, B>[]): Validation<S, B>;
    fromNullable<A, B>(value: B | null): Validation<A, B>;
    fromResult<A, B>(value: Result<A, B>): Validation<A, B>;
    fromMaybe<A, B>(value: Maybe<B>, failure: A): Validation<A, B>;
  }

  // -- Entry point
  export const core: Core;
  export const maybe: StaticMaybe;
  export const result: StaticResult;
  export const validation: StaticValidation;
}

export = folktale