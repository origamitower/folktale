-----------------------------------------------------------------------
-- This file contains type definitions that future implementations of
-- folktale aim to provide.
-----------------------------------------------------------------------

-- Note that the type notation used is described in:
-- https://github.com/origamitower/conventions/blob/master/documentation/type-notation.md

--[ v2.0.0 ]-----------------------------------------------------------
module Core.ADT where
  -- data(typeId, patterns)
  data :: (Any, Object ((...Any) => Object 'Any)) => ADT


  type ADT
  -- ADT.derive(...derivation)
  (ADT).derive :: (...(Variant, ADT) => Any) => ADT

  -- ADT.hasInstance(value)
  (ADT).hasInstance :: (Any) => Boolean


  type Variant
  -- Variant.prototype.matchWith(pattern)
  ('v: Variant*).matchWith :: ({ 'r | 'tag: (Object Any) => 'a) => 'a
                              where 'tag = 'v["@@folktale:adt:tag"]

  -- get Variant.tag
  (Variant).tag :: String

  -- get Variant.type
  (Variant).type :: Any

  -- Variant.hasInstance(value)
  (Variant).hasInstance :: (Any) => Boolean


  ----[ Derivations ]
  -- serialisation(Variant, ADT) (alias: serialization)
  serialisation :: (Variant, ADT) => Void -- provides .toJSON and .fromJSON


  -- equality(Variant, ADT) (alias: setoid)
  equality :: (Variant, ADT) => Void -- provides [fl.equals]

  -- debugRepresentation(Variant, ADT) (alias: show)
  debugRepresentation :: (Variant, ADT) => Void -- provides .toString, .inspect, Symbol.toStringTag



module Core.Lambda where
  -- compose(f, g)
  compose :: (('b) => 'c, ('a) => 'b) => (('a) => 'c)

  -- f::compose.infix(g)
  (('b) => 'c).compose.infix :: (('a) => 'b) => (('a) => 'c)

  -- compose.all(...fns)
  compose.all :: (Function...) => Function

  -- constant(a)(b)
  constant :: ('a) => ('b) => 'a

  -- identity(a)
  identity :: ('a) => ('a)

  -- curry(arity, computation)
  curry :: (Number, (Any... => 'a)) => (Any...) => 'a or Function 

  -- partialise(arity, computation)
  partialise :: (Number, (Any... => 'a)) 
             => ((hole or Any)...) => 'a or Function -- throws TypeError when given ≠ Number arguments



module Core.Object where
  -- fromPairs(pairs)
  fromPairs :: (Array (String or Symbol, 'a)) => Object 'a -- array of key/value to object

  -- toPairs(object)
  toPairs   :: (Object 'a) => Array (String or Symbol, 'a) 

  -- mapEntries(object, transformation, define)
  mapEntries :: (
    Object 'a, 
    ((String, 'a)) => (String, 'b), 
    (('x : Object 'b), String, 'b) => Object 'b -- mutates 'x
  ) => Object 'b

  -- mapEntries.overwrite(object, transformation)
  mapEntries.overwrite :: (Object 'a, ((String, 'a)) => (String, 'b)) => Object 'b

  -- mapEntries.unique(object, transformation)
  mapEntries.unique    :: (Object 'a, ((String, 'a)) => (String, 'b)) => Object 'b -- throws Error on duplicate props

  -- mapValues(object, transformation)
  mapValues :: (Object 'a, ('a) => 'b) => Object 'b

  -- object::mapValues.infix(transformation)
  (Object 'a).mapValues.infix :: (('a) => 'b) => Object 'b

  -- values(object)
  values :: (Object 'a) => Array 'a



module Data.Conversions where
  -- resultToMaybe(result)
  resultToMaybe :: (Result 'a 'b) => Maybe 'b

  -- resultToValidation(result)
  resultToValidation :: (Result 'a 'b) => Validation 'a 'b

  -- resultToTask(result)
  resultToTask :: (Result 'a 'b) => Task 'a 'b None

  -- maybeToResult(maybe)
  maybeToResult :: (Maybe 'a, 'b) => Result 'b 'a

  -- maybeToValidation(maybe)
  maybeToValidation :: (Maybe 'a, 'b) => Validation 'b 'a

  -- maybeToTask(maybe)
  maybeToTask :: (Maybe 'a, 'b) => Task 'b 'a None

  -- nullableToResult(value)
  nullableToResult :: ('a or None) => Result None 'a

  -- nullableToValidation(value)
  nullableToValidation :: ('a or None) => Validation None 'a

  -- validationToResult(validation)
  validationToResult :: (Validation 'a 'b) => Result 'a 'b

  -- validationToMaybe(validation)
  validationToMaybe :: (Validation 'a 'b) => Maybe 'b

  -- validationToTask(validation)
  validationToTask :: (Validation 'a 'b) => Task 'a 'b None

  -- promiseToTask(promise)
  promiseToTask :: (Promise 'a 'b) => Task 'b 'a None

  -- nodebackToTask(function)
  nodebackToTask :: (('a or None, 'b) => Void) => Task 'a 'b None


-- (previously from data.Either)
module Data.Result where
  type Result 'a 'b = Error 'a | Ok 'b
  implements Functor 'b, Applicative 'b, Monad 'b, Setoid, Show

  -- Result.prototype.get()
  (Result 'a 'b).get :: () => 'b -- throws with Left

  -- Result.prototype.getOrElse(default)
  (Result 'a 'b).getOrElse :: ('b) => 'b

  -- Result.prototype.orElse(recover)
  (Result 'a 'b).orElse :: (('a) => Result 'c 'b) => Result 'c 'b

  -- Result.prototype.fold(onError, onOk)
  (Result 'a 'b).fold :: (('a) => Result 'c 'd, ('b) => Result 'c 'd) => Result 'c 'd

  -- Result.prototype.merge()
  (Result 'a 'a).merge :: () => 'a

  -- Result.prototype.swap()
  (Result 'a 'b).swap :: () => Result 'b 'a

  -- Result.prototype.bimap(errorTransformation, okTransformation)
  (Result 'a 'b).bimap :: (('a) => 'c, ('b) => 'd) => Result 'c 'd

  -- Result.prototype.mapError(transformation)
  (Result 'a 'b).mapError :: (('a) => 'c) => Result 'c 'b

  -- Result.prototype.toJSON()
  (Result 'a 'b).toJSON :: () => JSON

  -- Result.prototype.toString()
  (Result 'a 'b).toString :: () => String

  -- Result.prototype.toValidation()
  (Result 'a 'b).toValidation :: () => Validation 'a 'b

  -- Result.prototype.toMaybe()
  (Result 'a 'b).toMaybe :: () => Maybe 'b

  -- Result.prototype.toTask()
  (Result 'a 'b).toTask :: () => Task 'a 'b None

  -- fromNullable(value)
   fromNullable :: ('a or None) => Result None 'a

   -- try(computation)
   try :: (() => 'a - throws 'b) => Result 'b 'a



module Data.Maybe where
  type Maybe 'a = Nothing | Just 'a
  implements Functor 'b, Applicative 'b, Monad 'b, Setoid, Show

  -- Maybe.prototype.get()
  (Maybe 'a).get :: () => 'a -- throws with Nothing

  -- Maybe.prototype.getOrElse(default)
  (Maybe 'a).getOrElse :: ('b) => 'b

  -- Maybe.prototype.orElse(recover)
  (Maybe 'a).orElse :: (('a) => Maybe 'b) => Maybe 'b

  -- Maybe.prototype.fold(onNothing, onJust)
  (Maybe 'a).fold :: (('a) => Maybe 'b, () => Maybe 'b) => Maybe 'b
  
  -- Maybe.prototype.toJSON()
  (Maybe 'a).toJSON :: () => JSON

  -- Maybe.prototype.toString()
  (Maybe 'a).toString :: () => String

  -- Maybe.prototype.toValidation()
  (Maybe 'a).toValidation :: ('b) => Validation 'b 'a

  -- Maybe.prototype.toResult()
  (Maybe 'a).toResult :: ('b) => Result 'b 'a

  -- Maybe.prototype.toTask()
  (Maybe 'a).toTask :: ('b) => Task 'b 'a None

  -- fromNullable(value)
  fromNullable :: ('a or None) => Maybe 'a



module Data.Validation where
  type Validation 'a 'b = Failure 'a | Success 'b
  implements Functor 'b, Applicative 'b, Setoid, Show

  -- Validation.prototype.get()
  (Validation 'a 'b).get :: () => 'b -- throws with Failure

  -- Validation.prototype.getOrElse(default)
  (Validation 'a 'b).getOrElse :: ('b) => 'b

  -- Validation.prototype.orElse(recover)
  (Validation 'a 'b).orElse :: (('a) => Validation 'c 'b) => Validation 'c 'b

  -- Validation.prototype.fold(onFailure, onSuccess)
  (Validation 'a 'b).fold :: (('a) => Validation 'c 'd, ('b) => Validation 'c 'd) => Validation 'c 'd

  -- Validation.prototype.merge()
  (Validation 'a 'a).merge :: () => 'a

  -- Validation.prototype.swap()
  (Validation 'a 'b).swap :: () => Validation 'b 'a

  -- Validation.prototype.bimap(failurTransformation, successTransformation)
  (Validation 'a 'b).bimap :: (('a) => 'c, ('b) => 'd) => Validation 'c 'd

  -- Validation.prototype.failureMap(transformation)
  (Validation 'a 'b).failureMap :: (('a) => 'c) => Validation 'c 'b
  
  -- Validation.prototype.concat(validation)
  (Validation (Array 'a) 'b).concat :: (Validation (Array 'a) 'b) => Validation (Array 'a) 'b

  -- Validation.prototype.toJSON()
  (Validation 'a 'b).toJSON :: () => JSON

  -- Validation.prototype.toString()
  (Validation 'a 'b).toString :: () => String

  -- Validation.prototype.toResult()
  (Validation 'a 'b).toResult :: () => Result 'a 'b

  -- Validation.prototype.toMaybe()
  (Validation 'a 'b).toMaybe :: () => Maybe 'b

  -- Validation.prototype.toTask()
  (Validation 'a 'b).toTask :: () => Task 'a 'b None

  -- fromNullable(value)
   fromNullable :: ('a or None) => Validation None 'a

   -- try(computation)
   try :: (() => 'a - throws 'b) => Validation 'b 'a



module Data.Task where
  type Task 'failure 'success 'resources = {
    computation :: ({ -- Using an object instead of positional args makes it easier to use
      resolve :: ('success) => Void
      reject  :: ('failure) => Void
      cancel  :: () => Void
    }) => 'resources
    cancel      :: ('resources) => Void
    cleanup     :: ('resources) => Void
  }
  implements Functor 'success, Applicative 'success, Monad 'success, Show

  -- Task(computation, onCancel?, cleanup?)
  Task :: (
    ({
      resolve :: ('success) => Void
      reject  :: ('failure) => Void
      cancel  :: () => Void
    }) => 'resources,
    (('resources) => Void)?,
    (('resources) => Void)?
  ) => Task 'failure 'success 'resources

  -- Task.prototype.run()
  (Task 'f 's 'r).run :: () => TaskExecution 'f 's 'r
  
  ---- Common fantasy land methods (note that resources are consumed when tasks are transformed!)
  -- Task.prototype.chain(transformation)
  (Task 'f 's 'r).chain :: (('s) => Task 'f 's2 'r2) => Task 'f 's2 'r2

  -- Task.prototype.map(transformation)
  (Task 'f 's 'r).map :: (('s) => 's2) => Task 'f 's2 None

  ---- (Executes both in parallel using .and)
  -- Task.prototype.ap(task)
  (Task 'f (('a) => 'b) 'r).ap :: (Task 'f 'a 'r2) => Task 'f 'b None

  ---- [ Constructing tasks ]
  -- Task.never()
  Task.never :: () => Task 'f 'a None -- Never resolves

  -- Task.of(value)
  Task.of :: ('a) => Task 'f 'a None

  -- Task.rejected(reason)
  Task.rejected :: ('a) => Task 'a 's None

  ---- [ Combining tasks ]
  -- Task.prototype.or(task)
  (Task 'f 's 'r).or :: (Task 'f 's 'r2) => Task 'f 's None -- race

  -- Task.prototype.orTry(task)
  (Task 'f 's 'r).orTry :: (Task 'f 's 'r2) => Task (Array 'f) 's None -- first successful, fails if all fails

  -- Task.prototype.and(task)
  (Task 'f 's 'r).and :: (Task 'f 's2 'r2) => Task 'f ('s, 's2) None -- parallel

  -- Taks.prototype.andThen(task)
  (Task 'f 's 'r).andThen :: (Task 'f 's2 'r2) => Task 'f ('s, 's2) None -- sequential

  ---- (These all work on non-empty arrays)
  -- race(tasks)
  race :: (Iterable (Task 'f 's *)) => Task 'f 's None

  -- tryAll(tasks)
  tryAll :: (Iterable (Task 'f 's *)) => Task (Array 'f) 's None -- first successful, fail if all fails

  -- parallel(tasks)
  parallel :: (Iterable (Task 'f 's *)) => Task 'f (Array 's) None

  -- sequential(tasks)
  sequential :: (Iterable (Task 'f 's *)) => Task 'f (Array 's) None  -- control.monads.sequence

  ---- Other ops
  -- Task.prototype.recover(recover)
  (Task 'f 's).recover :: (('f) => Task 'f2 's 'r2) => Task 'f2 's 'r2

  -- Task.prototype.swap()
  (Task 'f 's).swap :: () => Task 's 'f None

  -- Task.prototype.rejectionMap(transformation)
  (Task 'f 's).rejectionMap :: (('f) => 'f2) => Task 'f2 's None

  -- Task.prototype.bimap(onRejected, onResolved)
  (Task 'f 's).bimap :: (('f) => 'f2, ('s) => 's2) => Task 'f2 's2 None

  -- Task.prototype.toString()
  (Task 'f 's).toString :: () => String

  -- try(computation) 
  try :: (() => 'a - throws 'b) => Task 'b 'a None

  -- Execution state, not exported
  type ExecutionState 'a 'b = Pending | Cancelled | Rejected 'a | Resolved 'b
  implements Show


  -- Represents the execution of a task (not exported)
  type TaskExecution 'failure 'success 'resources = {
    task     :: Task 'failure 'success 'resources
    deferred :: Deferred 'failure 'success
  }
  implements Show

  -- TaskExecution.prototype.future()
  (TaskExecution 'f 's 'r).future :: () => Future 'f 's

  -- TaskExecution.prototype.promise()
  (TaskExecution 'f 's 'r).promise :: () => Promise 'f 's

  -- TaskExecution.prototype.cancel()
  (TaskExecution 'f 's 'r).cancel :: () => Void

  -- TaskExecution.prototype.listen(listener)
  (TaskExecution 'f 's 'r).listen :: (DeferredListener 'f 's) => Void


  -- Type for the listeners used in deferreds/task executions  
  type DeferredListener 'f 's = { 'r |
    onCancelled :: () => Void
    onRejected  :: ('f) => Void
    onResolved  :: ('s) => Void
  }


  -- Provides values for futures (not exported) 
  type Deferred 'failure 'success {
    state     :: ExecutionState 'failure 'success
    listeners :: Array (DeferredListener 'failure 'success) 
  }

  -- Deferred.prototype.resolve(value)
  (Deferred 'f 's).resolve :: ('s) => Void

  -- Deferred.prototype.reject(reason)
  (Deferred 'f 's).reject :: ('f) => Void

  -- Deferred.prototype.cancel()
  (Deferred 'f 's).cancel :: () => Void

  -- Deferred.prototype.listen(listener)
  (Deferred 'f 's).listen :: (DeferredListener 'f 's) => Void

  -- Deferred.prototype.future()
  (Deferred 'f 's).future :: () => Future 'f 's

  -- Deferred.prototype.promise()
  (Deferred 'f 's).promise :: () => Promise 'f 's -- Native JS promise


  -- Future represents a future value, without the problems Promise has (not exported)
  type Future 'failure 'success = {
    state     :: ExecutionState 'failure 'success
    listeners :: Array (DeferredListener 'failure 'success)
  }
  implements Functor 'success, Monad 'success, Applicative 'success, Show

  -- Future.prototype.bimap(onFailure, onSuccess)
  (Future 'f 's).bimap :: (('f) => 'f2, ('s) => 's2) => Future 'f2 's2

  -- Future.prototype.recover(recover)
  (Future 'f 's).recover :: (('f) => Future 'f2 's) => Future 'f2 's

  -- Future.prototype.swap()
  (Future 'f 's).swap :: () => Future 's 'f

  -- Future.prototype.mapRejection(transformation)
  (Future 'f 's).mapRejection :: (('f) => 'f2) => Future 'f2 's

  -- Future.prototype.toString()
  (Future 'f 's).toString :: () => String



module Control.Monads where
  -- map(Monad, values, transformation)
  map :: ('M, Iterable 'a, ('a) => 'M 'b) => 'M (Array 'b) 
         where 'M is Monad

  -- sequence(Monad, values)
  sequence :: ('M, Iterable ('M 'a)) => 'M (Array 'a) 
              where 'M is Monad

  -- compose(monadA, monadB)
  compose :: (('a) => 'M 'b, ('b) => 'M 'c) => ('a) => 'M 'c
             where 'M is Monad

  -- composeRight(monadB, monadA)
  composeRight :: (('b) => 'M 'c, ('a) => 'M 'b) => 'M 'c
                  where 'M is Monad

  -- join(monad)
  join :: ('M ('M 'a)) => 'M 'a
          where 'M is Monad
  
  -- filter(Monad, values, predicate)
  filter :: ('M, Iterable 'a, ('a) => Bool) => 'M 'a
            where 'M is Monad

  -- liftM2(monadA, monadB, computation)
  liftM2 :: ('M 'a, 'M 'b, ('a, 'b) => 'c) => 'M 'c
            where 'M is Monad

  -- liftM(Monad, values, computation)
  liftM :: ('M, Iterable 'a, ('a...) => 'b) => 'M 'b
           where 'M is Monad  
