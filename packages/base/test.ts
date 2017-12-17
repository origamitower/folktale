import * as _ from './index';
import { Maybe, Validation, Result, Future, Task } from './index';

//#region Core.Lambda
{
  const { compose, constant, identity } = _.core.lambda;

  const f = (a: number) => a.toString();
  const g = (a: string) => a.toUpperCase();

  const ex1: (_: number) => string = compose(g, f);
  const ex2: string = constant("foo")(1);
  const ex3: number = identity(1);
}
//#endregion


//#region Core.Object
{
  const { fromPairs,  toPairs, values, mapValues, mapEntries } = _.core.object;
  const xs: [string, number][] = [['a', 1], ['b', 2]];

  const ex1: { [key: string]: number } = fromPairs(xs);
  const ex2: [string, number][] = toPairs({ a: 1, b: 2 });
  const ex3: number[] = values({ a: 1, b: 2 });
  const ex4: { [key: string]: string } = mapValues({ a: 1, b: 2 }, (x) => x.toString());
  const ex5: { [key: string]: string } = mapEntries.overwrite({ a: 1 }, ([k, v]) => [k, v.toString()]);
  const ex6: { [key: string]: string } = mapEntries.unique({ a: 1 }, ([k, v]) => [k, v.toString()]);
  const ex7: { [key: string]: string } = mapEntries({ a: 1 }, 
                                                    ([k, v]) => [k, v.toString()], 
                                                    (o, k, v) => Object.assign(o, { [k]: v }));
}
//#endregion


//#region Maybe
{
  const ex1: Maybe<string> = _.maybe.of("foo");
  const ex2: Maybe<never> = _.maybe.empty();
  const ex3: Maybe<string> = _.maybe.Just("foo");
  const ex4: Maybe<never> = _.maybe.Nothing();

  const ex5: boolean = _.maybe.hasInstance(null);
  const ex6: Maybe<number> = _.maybe.fromNullable(1);
  const ex7: Maybe<number> = _.maybe.fromNullable(null);

  const ex8: Maybe<number> = _.maybe.fromResult(_.result.Ok(1));
  const ex9: Maybe<never> = _.maybe.fromResult(_.result.Error("a"));

  const ex10: Maybe<number> = _.maybe.fromValidation(_.validation.Success(1));
  const ex11: Maybe<never> = _.maybe.fromValidation(_.validation.Failure("a"));

  const f = (x: number) => x.toString();

  const ex12: Maybe<string> = _.maybe.of(1).map(x => x.toString());
  const ex13: Maybe<string> = _.maybe.of(f).apply(_.maybe.of(1));
  const ex14: Maybe<string> = _.maybe.of(1).chain(x => _.maybe.of(x.toString()));
  const ex15: number = _.maybe.of(1).getOrElse(2);
  const ex15_: number = _.maybe.empty<number>().getOrElse(2);
  const ex16: Maybe<number> = _.maybe.of(1).orElse(() => _.maybe.of(2));
  const ex17: Maybe<string> = _.maybe.of('f').concat(_.maybe.of('g'));
  const ex18: Maybe<string> = _.maybe.of('f').filter(x => false);
  const ex19: number = _.maybe.of(1).matchWith({
    Just: ({ value }) => value + 1,
    Nothing: (_) => 0
  });
  const ex20: Result<string, number> = _.maybe.of(1).toResult('f');
  const ex21: Validation<string, number> = _.maybe.of(1).toValidation('g');

  const ex22: string = _.maybe.of(1).inspect();
  const ex23: string = _.maybe.of(1).toString();

  const ex24: boolean = _.maybe.of(1).equals(_.maybe.of(2));
  const ex25: string = _.maybe.of('foo').unsafeGet();
  const ex26: string = _.maybe.of(1).fold(f, () => 'g');
  const ex27: number = _.maybe.empty().fold((_) => 2, () => 3);
}
//#endregion

//#region Result
{
  const ex1: Result<string, never> = _.result.Error('foo');
  const ex2: Result<never, string> = _.result.Ok('foo');
  const ex3: boolean = _.result.hasInstance(null);
  const ex4: Result<never, string> = _.result.of('foo');
  const ex5: Result<number, never> = _.result.try(() => { throw 1 }); // not actually checked since TS doesn't have effects
  const ex6: Result<never, number> = _.result.try(() => 1);

  const ex7: Result<number, string> = _.result.fromNullable('foo', 1);
  const ex8: Result<number, {}> = _.result.fromNullable(null, 1);
  const ex9: Result<string, never> = _.result.fromValidation(_.validation.Failure('foo'));
  const ex10: Result<never, string> = _.result.fromValidation(_.validation.Success('foo'));
  const ex11: Result<string, never> = _.result.fromMaybe(_.maybe.Nothing(), 'foo');
  const ex12: Result<string, number> = _.result.fromMaybe(_.maybe.of(1), 'foo');

  const ex13: Result<{}, string> = _.result.of(1).map(x => x.toString());
  const ex14: Result<{}, string> = _.result.of((x: number) => x.toString()).apply(_.result.of(1));
  const ex15: Result<{}, string> = _.result.of(1).chain(x => _.result.of(x.toString()));
  const ex16: number = _.result.of(1).getOrElse(2);
  const ex17: number = _.result.Error<string, number>('foo').getOrElse(2);
  const ex18: Result<number, number> = _.result.Error<number, number>(1).orElse(x => _.result.Ok(2));
  const ex19: Result<{}, string> = _.result.of('1').concat(_.result.of('2'));
  const ex20: Result<number, {}> = _.result.of(1).swap();
  const ex21: Result<{}, number> = _.result.Error(1).swap();
  const ex22: Result<{}, string> = _.result.of(1).bimap(x => x, x => x.toString());
  const ex23: Result<string, {}> = _.result.Error(1).bimap(x => x.toString(), x => x);
  const ex24: Result<string, {}> = _.result.Error(1).mapError(x => x.toString());
  const ex25: Result<{}, string> = _.result.of('f').filter(x => x.slice(0, 1) === 'f');
  const ex26: number = _.result.of<number, number>(1).merge();
  const ex27: number | string = _.result.Error<string, number>('f').merge();
  const ex28: Validation<string, {}> = _.result.Error('f').toValidation();
  const ex29: Validation<{}, string> = _.result.Ok('f').toValidation();
  const ex30: Maybe<string> = _.result.Ok('f').toMaybe();
  const ex31: Maybe<{}> = _.result.Error('f').toMaybe();

  const ex32: boolean = _.result.Ok(1).equals(_.result.Ok(2));
  const ex33: string = _.result.Ok(1).inspect();
  const ex34: string = _.result.Ok(1).toString();
  const ex35: string = _.result.Ok('f').unsafeGet();
  const ex36: number = _.result.Error<string, number>('f').unsafeGet();
  const ex37: string = _.result.Ok(1).fold(x => '1', x => x.toString());
  const ex38: string = _.result.Error(1).fold(x => x.toString(), x => '3');
  const ex39: string = _.result.Ok(1).matchWith({
    Error: ({ value }) => 'f',
    Ok: ({ value }) => value.toString()
  });
  const ex40: string = _.result.Error(1).matchWith({
    Error: ({ value }) => value.toString(),
    Ok: ({ value }) => 'f'
  });
}
//#endregion


//#region Validation
{
  const ex1: Validation<string, never> = _.validation.Failure('foo');
  const ex2: Validation<never, string> = _.validation.Success('foo');
  const ex3: boolean = _.validation.hasInstance(null);
  const ex4: Validation<never, string> = _.validation.of('foo');
  const ex5: Validation<string, {}> = _.validation.collect([
    _.validation.Failure('a'),
    _.validation.Failure('b')
  ]);


  const ex7: Validation<number, string> = _.validation.fromNullable('foo', 1);
  const ex8: Validation<number, {}> = _.validation.fromNullable(null, 1);
  const ex9: Validation<string, never> = _.validation.fromResult(_.result.Error('foo'));
  const ex10: Validation<never, string> = _.validation.fromResult(_.result.Ok('foo'));
  const ex11: Validation<string, never> = _.validation.fromMaybe(_.maybe.Nothing(), 'foo');
  const ex12: Validation<string, number> = _.validation.fromMaybe(_.maybe.of(1), 'foo');

  const ex13: Validation<{}, string> = _.validation.of(1).map(x => x.toString());
  const ex14: Validation<string, string> = _.validation.of<string, (_: number) => string>(x => x.toString()).apply(_.validation.of(1));
  const ex16: number = _.validation.of(1).getOrElse(2);
  const ex17: number = _.validation.Failure<string, number>('foo').getOrElse(2);
  const ex18: Validation<number, number> = _.validation.Failure<number, number>(1).orElse(x => _.validation.Success(2));
  const ex19: Validation<string, {}> = _.validation.Failure('1').concat(_.validation.Failure('2'));
  const ex20: Validation<number, {}> = _.validation.of(1).swap();
  const ex21: Validation<{}, number> = _.validation.Failure(1).swap();
  const ex22: Validation<{}, string> = _.validation.of(1).bimap(x => x, x => x.toString());
  const ex23: Validation<string, {}> = _.validation.Failure(1).bimap(x => x.toString(), x => x);
  const ex24: Validation<string, {}> = _.validation.Failure(1).mapFailure(x => x.toString());
  const ex25: Validation<{}, string> = _.validation.of('f').filter(x => x.slice(0, 1) === 'f');
  const ex26: number = _.validation.of<number, number>(1).merge();
  const ex27: number | string = _.validation.Failure<string, number>('f').merge();
  const ex28: Result<string, {}> = _.validation.Failure('f').toResult();
  const ex29: Result<{}, string> = _.validation.Success('f').toResult();
  const ex30: Maybe<string> = _.validation.Success('f').toMaybe();
  const ex31: Maybe<{}> = _.validation.Failure('f').toMaybe();

  const ex32: boolean = _.validation.Success(1).equals(_.validation.Success(2));
  const ex33: string = _.validation.Success(1).inspect();
  const ex34: string = _.validation.Success(1).toString();
  const ex35: string = _.validation.Success('f').unsafeGet();
  const ex36: number = _.validation.Failure<string, number>('f').unsafeGet();
  const ex37: string = _.validation.Success(1).fold(x => '1', x => x.toString());
  const ex38: string = _.validation.Failure(1).fold(x => x.toString(), x => '3');
  const ex39: string = _.validation.Success(1).matchWith({
    Failure: ({ value }) => 'f',
    Success: ({ value }) => value.toString()
  });
  const ex40: string = _.validation.Failure(1).matchWith({
    Failure: ({ value }) => value.toString(),
    Success: ({ value }) => 'f'
  });
}
//#endregion

//#region Futures
{
  const future = _.concurrency.future;

  const ex1: Future<never, string> = future.of('a');
  const ex2: Future<string, never> = future.rejected('a');
  const ex3: Future<{}, string> = future.fromPromise(Promise.resolve('a'));
  
  const ex4: Promise<string> = future.of('a').toPromise();
  const ex5: string = future.of('a').inspect();
  const ex6: string = future.of(1).toString();

  const ex7: Future<{}, string> = future.of(1).willMatchWith({
    Cancelled: () => future.of('nope'),
    Resolved: (v) => future.of(v.toString()),
    Rejected: (_) => future.of('nah')
  });

  const ex8: Future<{}, number> = future.of(1).listen({
    onCancelled: () => null,
    onResolved: (v) => { v.toExponential() },
    onRejected: (_) => null
  });

  const ex9: Future<number, {}> = future.rejected(2).orElse(x => future.rejected(3));
  const ex10: Future<number, {}> = future.of(1).swap();
  const ex11: Future<{}, number> = future.rejected(1).swap();
  const ex12: Future<{}, string> = future.of((x: number) => x.toFixed()).apply(future.of(2));
  const ex13: Future<{}, string> = future.of(2).bimap(x => x, x => x.toFixed());
  const ex14: Future<string, {}> = future.rejected(2).bimap(x => x.toFixed(), x => x);
  const ex15: Future<{}, string> = future.of(2).chain(x => future.of(x.toFixed()));
  const ex16: Future<{}, string> = future.of(2).map(x => x.toFixed());
  const ex17: Future<string, {}> = future.rejected(2).mapRejected(x => x.toFixed());
  const ex18: Future<number, {}> = future.rejected(2).recover(x => future.rejected(x + 1));
}
//#endregion

//#region Task
{
  const task = _.concurrency.task;

  const ex1: Task<never, string> = task.of('a');
  const ex2: Task<string, never> = task.rejected('a');
  const ex3: Task<{}, number[]> = task.waitAll([task.of(1), task.of(2)]);
  const ex4: Task<{}, number> = task.waitAny([task.of(1), task.of(2)]);
  const ex5: Task<{}, number> =  task.of(1);
  const ex6: Task<number, {}> = task.rejected(1);
  const ex7: Task<number, string> = task.task(r => {
    r.resolve('a');
    r.reject(2);
    r.cancel();
    const a: boolean = r.isCancelled;
    r.cleanup(() => {});
    r.onCancelled(() => {});
  });

  const ex8: () => Task<never, number> = task.fromNodeback((cb: (e: never, v: number) => void) => {});
  const ex9: () => Task<{}, number> = task.fromPromised(() => Promise.resolve(1));

  const ex10: Task<{}, number> = task.do(function* () {
    const x: number = yield task.of(1);
    return task.of(x);
  });

  const ex11: Task<{}, [number, string]> = task.of(1).and(task.of('foo'));
  const ex12: Task<{}, number> = task.of(1).or(task.of(2));
  const ex13: Task<{}, string> = task.of(1).willMatchWith({
    Cancelled: () => task.of('no'),
    Resolved: (value) => task.of(value.toFixed()),
    Rejected: (value) => task.rejected(value)
  });
  const ex14: Task<string, {}> = task.rejected(1).willMatchWith({
    Cancelled: () => task.rejected(''),
    Resolved: (value) => task.of(value),
    Rejected: (value) => task.rejected(value.toFixed())
  });

  const ex15: Task<string, number> = task.of<string, number>(1).orElse(x => task.rejected(x.concat(x)));
  const ex16: Task<string, number> = task.of<number, string>('foo').swap();
  const ex17: Task<{}, string> = task.of((x: number) => x.toFixed()).apply(task.of(1));
  const ex18: Task<{}, string> = task.of(1).bimap(x => x, x => x.toFixed());
  const ex19: Task<string, {}> = task.rejected(1).bimap(x => x.toFixed(), x => x);
  const ex20: Task<{}, string> = task.of(1).chain(x => task.of(x.toFixed()));
  const ex21: Task<{}, string> = task.of(1).map(x => x.toFixed());
  const ex22: Task<string, {}> = task.rejected(1).mapRejected(x => x.toFixed());
}
//#endregion

//#region Conversions
{
  const c = _.conversions;

  const ex1: Promise<number> = c.futureToPromise(_.concurrency.future.of(1));
  const ex2: Result<string, number> = c.maybeToResult(_.maybe.of(1), 'bar');
  const ex3: Validation<string, number> = c.maybeToValidation(_.maybe.of(1), 'bar');
  const ex4: Future<any, string> = c.promiseToFuture(Promise.resolve('f'));
  const ex5: Maybe<string> = c.resultToMaybe(_.result.of('f'));
  const ex6: Validation<{}, string> = c.resultToValidation(_.result.Ok('f'));
  const ex7: Validation<number, {}> = c.resultToValidation(_.result.Error(1));
  const ex8: Maybe<string> = c.validationToMaybe(_.validation.Success('f'));
  const ex9: Result<{}, number> = c.validationToResult(_.validation.Success(1));
  const ex10: Result<number, {}> = c.validationToResult(_.validation.Failure(1));
  const ex11: () => Task<any, number> = c.promisedToTask(() => Promise.resolve(1));
  const ex12: () => Task<number, string> = c.nodebackToTask((cb: (e: number, v: string) => void) => {});
  const ex13: Maybe<string> = c.nullableToMaybe('2');
  const ex14: Result<string, number> = c.nullableToResult(21, 'error');
  const ex15: Validation<number, string> = c.nullableToValidation('f', 34);
}
//#endregion