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
  type Result<A, B> = Err<A, B> | Ok<A, B>;

  interface Err<A, B> {
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

  // -- Concurrency
  interface Future<A, B> {
    toPromise(): Promise<B>
    inspect(): string
    toString(): string

    willMatchWith<C, D>(patterns: {
      Cancelled(): Future<C, D>,
      Resolved(value: B): Future<C, D>,
      Rejected(reason: A): Future<C, D>
    }): Future<C, D>

    listen(patterns: {
      onCancelled(): void,
      onResolved(value: B): void,
      onRejected(reason: A): void
    }): Future<A, B>

    orElse(handler: (_: A) => Future<A, B>): Future<A, B>
    swap(): Future<B, A>
    apply<C>(this: Future<A, (_: B) => C>, that: Future<A, B>): Future<A, C>
    bimap<C, D>(onRejected: (_: A) => C, onResolved: (_: B) => D): Future<C, D>
    chain<C>(f: (_: B) => Future<A, C>): Future<A, C>
    map<C>(f: (_: B) => C): Future<A, C>
    mapRejected<C>(f: (_: A) => C): Future<C, B>


    /** @deprecated */
    recover(handler: (_: A) => Future<A, B>): Future<A, B>
  }

  interface StaticFuture {
    of<A, B>(value: B): Future<A, B>
    rejected<A, B>(reason: A): Future<A, B>
    fromPromise<B>(promise: Promise<B>): Future<Error, B>
  }

  interface TaskExecution<A, B> {
    cacel(): TaskExecution<A, B>

    listen(pattern: {
      onCancelled(): void,
      onResolved(value: B): void,
      onRejected(reason: A): void
    }): TaskExecution<A, B>

    promise(): Promise<B>
    future(): Future<A, B>
  }

  interface Task<A, B> {
    and<B2>(that: Task<A, B2>): Task<A, [B, B2]>
    or<B2>(that: Task<A, B2>): Task<A, B | B2>
    run(): TaskExecution<A, B>
    
    willMatchWith<A2, B2>(patterns: {
      Cancelled(): Task<A2, B2>,
      Resolved(value: B): Task<A2, B2>,
      Rejected(reason: A): Task<A2, B2>
    }): Task<A2, B2>

    orElse(handler: (_: A) => Task<A, B>): Task<A, B>
    swap(): Task<B, A>
    apply<B2>(this: Task<A, (_: B) => B2>, that: Task<A, B>): Task<A, B2>
    bimap<A2, B2>(onRejected: (_: A) => A2, onResolved: (_: B) => B2): Task<A2, B2>
    chain<B2>(f: (_: B) => Task<A, B2>): Task<A, B2>
    map<B2>(f: (_: B) => B2): Task<A, B2>
    mapRejected<A2>(f: (_: A) => A2): Task<A2, B>
  }

  interface StaticTask {
    waitAll<E, V>(tasks: Task<E, V>[]): Task<E, V[]>
    waitAny<E, V>(tasks: Task<E, V>[]): Task<E, V>
    of<E, V>(value: V): Task<E, V>
    rejected<E, V>(reason: E): Task<E, V>
    task<E, V>(resolver: TaskResolver<E, V>): Task<E, V>
    fromNodeback<E, V>(fn: (cb: (e: E, v: V) => void) => void): () =>  Task<E, V>
    fromNodeback<A, E, V>(fn: (a1: A, cb: (e: E, v: V) => void) => void): (a1: A) =>  Task<E, V>
    fromNodeback<A, A2, E, V>(fn: (a1: A, a2: A2, cb: (e: E, v: V) => void) => void): (a1: A, a2: A2) =>  Task<E, V>
    fromNodeback<A, A2, A3, E, V>(fn: (a1: A, a2: A2, a3: A3, cb: (e: E, v: V) => void) => void): (a1: A, a2: A2, a3: A3) =>  Task<E, V>
    fromNodeback<A, A2, A3, A4, E, V>(fn: (cb: (a1: A, a2: A2, a3: A3, a4: A4, e: E, v: V) => void) => void): (a1: A, a2: A2, a3: A3, a4: A4) =>  Task<E, V>
    fromNodeback<A, A2, A3, A4, A5, E, V>(fn: (a1: A, a2: A2, a3: A3, a4: A4, a5: A5, cb: (e: E, v: V) => void) => void): (a1: A, a2: A2, a3: A3, a4: A4, a5: A5) =>  Task<E, V>
    fromNodeback<A, A2, A3, A4, A5, A6, E, V>(fn: (a1: A, a2: A2, a3: A3, a4: A4, a5: A5, a6: A6, cb: (e: E, v: V) => void) => void): (a1: A, a2: A2, a3: A3, a4: A4, a5: A5, a6: A6) =>  Task<E, V>
    
    fromPromised<E, V>(fn: () => Promise<V>): () =>  Task<E, V>
    fromPromised<A, E, V>(fn: (a1: A) => Promise<V>): (a1: A) =>  Task<E, V>
    fromPromised<A, A2, E, V>(fn: (a1: A, a2: A2) => Promise<V>): (a1: A, a2: A2) =>  Task<E, V>
    fromPromised<A, A2, A3, E, V>(fn: (a1: A, a2: A2, a3: A3) => Promise<V>): (a1: A, a2: A2, a3: A3) =>  Task<E, V>
    fromPromised<A, A2, A3, A4, E, V>(fn: (a1: A, a2: A2, a3: A3, a4: A4) => Promise<V>): (a1: A, a2: A2, a3: A3, a4: A4) =>  Task<E, V>
    fromPromised<A, A2, A3, A4, A5, E, V>(fn: (a1: A, a2: A2, a3: A3, a4: A4, a5: A5) => Promise<V>): (a1: A, a2: A2, a3: A3, a4: A4, a5: A5) =>  Task<E, V>
    fromPromised<A, A2, A3, A4, A5, A6, E, V>(fn: (a1: A, a2: A2, a3: A3, a4: A4, a5: A5, a6: A6) => Promise<V>): (a1: A, a2: A2, a3: A3, a4: A4, a5: A5, a6: A6) =>  Task<E, V>
    
    do<E, V>(generator: GeneratorFunction): Task<E, V>
  }

  interface TaskResolver<E, V> {
    resolve(value: V): void
    reject(reason: E): void
    cancel(): void
    cleanup(handler: () => void): void
    onCancelled(handler: () => void): void
    isCancelled: boolean
  }

  // -- Entry point
  export const core: Core;
  export const maybe: StaticMaybe;
  export const result: StaticResult;
  export const validation: StaticValidation;
  export const concurrency: {
    task: StaticTask
    future: StaticFuture
  };
}

export = folktale