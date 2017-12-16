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
    mapEntries: MapEntries
  }

  type Dict<A> = { [key: string]: A };

  interface MapEntries {
    <A, B>(object: Dict<A>, transform: (pair: [string, A]) => [string, B], define: (object: Dict<B>, key: string, value: B) => Dict<B>): Dict<B>

    overwrite<A, B>(object: Dict<A>, transform: (pair: [string, A]) => [string, B]): Dict<B>
    unique<A, B>(object: Dict<A>, transform: (pair: [string, A]) => [string, B]): Dict<B>
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
    apply<A, B>(this: Maybe<(_: A) => B>, f: Maybe<A>): Maybe<B>;
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
    inspect(): string;
    toString(): string;
    equals(that: Maybe<A>): boolean;
    unsafeGet(): A;
    fold<B>(onJust: (_: A) => B, onNothing: () => B): B;
  }

  interface Nothing<A> {
    __type: A;
    __tag: 'Nothing';
    map<B>(f: (_: A) => B): Maybe<B>;
    apply<A, B>(this: Maybe<(_: A) => B>, f: Maybe<A>): Maybe<B>;
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
    inspect(): string;
    toString(): string;
    equals(that: Maybe<A>): boolean;
    unsafeGet(): A;
    fold<B>(onJust: (_: A) => B, onNothing: () => B): B;
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
    apply<A, B, C>(this: Result<A, (_: B) => C>, that: Result<A, B>): Result<A, C>;
    chain<C>(f: (_: B) => Result<A, C>): Result<A, C>;
    getOrElse(_default: B): B;
    orElse(f: (_: A) => Result<A, B>): Result<A, B>;
    concat<S extends Semigroup<B>>(this: Result<A, S>, that: Result<A, S>): Result<A, S>;
    swap(): Result<B, A>;
    bimap<C, D>(error: (_: A) => C, ok: (_: B) => D): Result<C, D>;
    mapError<C>(f: (_: A) => C): Result<C, B>;
    filter(f: (_: B) => boolean): Result<A, B>;
    merge(): A | B;
    toValidation(): Validation<A, B>;
    toMaybe(): Maybe<B>;
    equals(that: Result<A, B>): boolean;
    inspect(): string;
    toString(): string;
    unsafeGet(): B;
    fold<C>(onError: (_: A) => C, onOk: (_: B) => C): C;
    matchWith<R>(pattern: {
      Error: (_: { value: A }) => R
      Ok: (_: { value: B }) => R
    }): R;
  }

  interface Ok<A, B> {
    __type0: A;
    __type1: B;
    __tag: 'Ok';
    value: B;

    map<C>(f: (_: B) => C): Result<A, C>;
    apply<A, B, C>(this: Result<A, (_: B) => C>, that: Result<A, B>): Result<A, C>;
    chain<C>(f: (_: B) => Result<A, C>): Result<A, C>;
    getOrElse(_default: B): B;
    orElse(f: (_: A) => Result<A, B>): Result<A, B>;
    concat<S extends Semigroup<B>>(this: Result<A, S>, that: Result<A, S>): Result<A, S>;
    swap(): Result<B, A>;
    bimap<C, D>(error: (_: A) => C, ok: (_: B) => D): Result<C, D>;
    mapError<C>(f: (_: A) => C): Result<C, B>;
    filter(f: (_: B) => boolean): Result<A, B>;
    merge(): A | B;
    toValidation(): Validation<A, B>;
    toMaybe(): Maybe<B>;
    equals(that: Result<A, B>): boolean;
    inspect(): string;
    toString(): string;
    unsafeGet(): B;
    fold<C>(onError: (_: A) => C, onOk: (_: B) => C): C;
    matchWith<R>(pattern: {
      Error: (_: { value: A }) => R
      Ok: (_: { value: B }) => R
    }): R;
  }

  interface StaticResult {
    Error<A, B>(value: A): Result<A, B>;
    Ok<A, B>(value: B): Result<A, B>;
    hasInstance(value: any): boolean;
    of<A, B>(value: B): Result<A, B>;
    try<A, B>(f: (() => B)): Result<A, B>;
    fromNullable<B>(value: B | null | undefined): Result<null | undefined, B>;
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
    apply<A, B, C, S extends Semigroup<A>>(this: Validation<S, (_: B) => C>, that: Validation<S, B>): Validation<S, C>;
    getOrElse(_default: B): B;
    orElse(f: (_: A) => Validation<A, B>): Validation<A, B>;
    concat<S extends Semigroup<A>>(this: Validation<S, B>, that: Validation<S, B>): Validation<S, B>;
    swap(): Validation<B, A>;
    bimap<C, D>(error: (_: A) => C, ok: (_: B) => D): Validation<C, D>;
    mapFailure<C>(f: (_: A) => C): Validation<C, B>;
    filter(f: (_: B) => boolean): Validation<A, B>;
    merge(): A | B;
    toResult(): Result<A, B>;
    toMaybe(): Maybe<B>;
    equals(that: Validation<A, B>): boolean;
    inspect(): string;
    toString(): string;
    unsafeGet(): B;
    fold<C>(onFailure: (_: A) => C, onSuccess: (_: B) => C): C;
    matchWith<R>(pattern: {
      Failure: (_: { value: A }) => R
      Success: (_: { value: B }) => R
    }): R;
  }

  interface Success<A, B> {
    __type0: A;
    __type1: B;
    __tag: 'Success';
    value: B;

    map<C>(f: (_: B) => C): Validation<A, C>;
    apply<A, B, C, S extends Semigroup<A>>(this: Validation<S, (_: B) => C>, that: Validation<S, B>): Validation<S, C>;
    getOrElse(_default: B): B;
    orElse(f: (_: A) => Validation<A, B>): Validation<A, B>;
    concat<S extends Semigroup<A>>(this: Validation<S, B>, that: Validation<S, B>): Validation<S, B>;
    swap(): Validation<B, A>;
    bimap<C, D>(error: (_: A) => C, ok: (_: B) => D): Validation<C, D>;
    mapFailure<C>(f: (_: A) => C): Validation<C, B>;
    filter(f: (_: B) => boolean): Validation<A, B>;
    merge(): A | B;
    toResult(): Result<A, B>;
    toMaybe(): Maybe<B>;
    equals(that: Validation<A, B>): boolean;
    inspect(): string;
    toString(): string;
    unsafeGet(): B;
    fold<C>(onFailure: (_: A) => C, onSuccess: (_: B) => C): C;
    matchWith<R>(pattern: {
      Failure: (_: { value: A }) => R
      Success: (_: { value: B }) => R
    }): R;
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
    apply<A, B, C>(this: Future<A, (_: B) => C>, that: Future<A, B>): Future<A, C>
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
    cancel(): TaskExecution<A, B>

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
    apply<A, B, B2>(this: Task<A, (_: B) => B2>, that: Task<A, B>): Task<A, B2>
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
    task<E, V>(resolver: (_: TaskResolver<E, V>) => void): Task<E, V>
    
    fromNodeback<E, V>(fn: (cb: (e: E, v: V) => void) => void): () => Task<E, V>    
    fromPromised<E, V>(fn: () => Promise<V>): () =>  Task<E, V>
    
    do<E, V>(generator: () => IterableIterator<Task<E, V>>): Task<E, V>
  }

  interface TaskResolver<E, V> {
    resolve(value: V): void
    reject(reason: E): void
    cancel(): void
    cleanup(handler: () => void): void
    onCancelled(handler: () => void): void
    isCancelled: boolean
  }

  // -- Conversions
  interface Conversions {
    futureToPromise<E, V>(future: Future<E, V>): Promise<V>
    maybeToResult<A, B>(maybe: Maybe<A>, fallback: B): Result<B, A>
    maybeToValidation<A, B>(maybe: Maybe<A>, fallback: B): Validation<B, A>
    promiseToFuture<V>(promise: Promise<V>): Future<any, V>
    resultToMaybe<A, B>(result: Result<A, B>): Maybe<B>
    resultToValidation<A, B>(result: Result<A, B>): Validation<A, B>
    validationToMaybe<A, B>(validation: Validation<A, B>): Maybe<B>
    validationToResult<A, B>(validation: Validation<A, B>): Result<A, B>


    promisedToTask<V>(fn: () => Promise<V>): () => Task<any, V>
    promisedToTask<V, A1>(fn: (a: A1) => Promise<V>): (a: A1) => Task<any, V>
    promisedToTask<V, A1, A2>(fn: (a: A1, b: A2) => Promise<V>): (a: A1, b: A2) => Task<any, V>
    promisedToTask<V, A1, A2, A3>(fn: (a: A1, b: A2, c: A3) => Promise<V>): (a: A1, b: A2, c: A3) => Task<any, V>
    promisedToTask<V, A1, A2, A3, A4>(fn: (a: A1, b: A2, c: A3, d: A4) => Promise<V>): (a: A1, b: A2, c: A3, d: A4) => Task<any, V>
    promisedToTask<V, A1, A2, A3, A4, A5>(fn: (a: A1, b: A2, c: A3, d: A4, e: A5) => Promise<V>): (a: A1, b: A2, c: A3, d: A4, e: A5) => Task<any, V>
    promisedToTask<V, A1, A2, A3, A4, A5, A6>(fn: (a: A1, b: A2, c: A3, d: A4, e: A5, f: A6) => Promise<V>): (a: A1, b: A2, c: A3, d: A4, e: A5, f: A6) => Task<any, V>

    nodebackToTask<E, V>(fn: (cb: (error: E, value: V) => void) => void): () => Task<E, V>
    nodebackToTask<E, V, A1>(fn: (a: A1, cb: (error: E, value: V) => void) => void): (a: A1) => Task<E, V>
    nodebackToTask<E, V, A1, A2>(fn: (a: A1, b: A2, cb: (error: E, value: V) => void) => void): (a: A1, b: A2) => Task<E, V>
    nodebackToTask<E, V, A1, A2, A3>(fn: (a: A1, b: A2, c: A3, cb: (error: E, value: V) => void) => void): (a: A1, b: A2, c: A3) => Task<E, V>
    nodebackToTask<E, V, A1, A2, A3, A4>(fn: (a: A1, b: A2, c: A3, d: A4, cb: (error: E, value: V) => void) => void): (a: A1, b: A2, c: A3, d: A4) => Task<E, V>
    nodebackToTask<E, V, A1, A2, A3, A4, A5>(fn: (a: A1, b: A2, c: A3, d: A4, e: A5, cb: (error: E, value: V) => void) => void): (a: A1, b: A2, c: A3, d: A4, e: A5) => Task<E, V>
    nodebackToTask<E, V, A1, A2, A3, A4, A5, A6>(fn: (a: A1, b: A2, c: A3, d: A4, e: A5, f: A6, cb: (error: E, value: V) => void) => void): (a: A1, b: A2, c: A3, d: A4, e: A5, f: A6) => Task<E, V>
    
    nullableToMaybe<A>(value: A | null | undefined): Maybe<A>
    nullableToResult<A>(value: A | null | undefined): Result<null | undefined, A>
    nullableToValidation<A, B>(value: A | null | undefined, fallback: B): Validation<B, A>
  }

  // -- Entry point
  export const core: Core;
  export const maybe: StaticMaybe;
  export const result: StaticResult;
  export const validation: StaticValidation;
  export const conversions: Conversions;
  export const concurrency: {
    task: StaticTask
    future: StaticFuture
  };
}

export = folktale