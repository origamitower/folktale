-----------------------------------------------------------------------
-- This file contains type definitions that future implementations of
-- folktale aim to provide.
-----------------------------------------------------------------------

-- Note that the type notation used is described in:
-- https://github.com/origamitower/conventions/blob/master/documentation/type-notation.md

--[ v2.0.0 ]-----------------------------------------------------------
module Core.ADT where
  TODO



module Core.Lambda where
  -- | Composes two (or more) functions together
  compose :: (('b) => 'c, ('a) => 'b) => (('a) => 'c)
  compose.infix :: (('b) => 'c) . (('a) => 'b) => (('a) => 'c)
  compose.all   :: (Function...) => Function

  -- | Lambda calculus combinators
  constant :: ('a) => ('b) => 'a
  identity :: ('a) => ('a)

  -- | Curry with the possibility of providing more than one argument at a time
  curry :: (Number, (Any... => 'a)) => (Any...) => 'a or ((Any...) => 'a)

  -- | Transforms a function into one that accepts partial arguments (see SRFI 26)
  partialise :: (Number, (Any... => Any)) => ((hole or Any)...) => Any -- throws TypeError when given ≠ Number arguments



module Core.Object where
  fromPairs :: (Array (String or Symbol, 'a)) => Object 'a -- array of key/value to object
  toPairs   :: (Object 'a) => Array (String or Symbol, 'a) 

  mapEntries :: (
    Object 'a, 
    ((String, 'a)) => (String, 'b), 
    (('x : Object 'b), String, 'b) => Object 'b -- mutates 'x
  ) => Object 'b

  mapEntries.overwrite :: (Object 'a, ((String, 'a)) => (String, 'b)) => Object 'b
  mapEntries.unique    :: (Object 'a, ((String, 'a)) => (String, 'b)) => Object 'b -- throws Error on duplicate props

  mapValues :: (Object 'a, ('a) => 'b) => Object 'b
  mapValues.infix :: (Object 'a) . (('a) => 'b) => Object 'b

  values :: (Object 'a) => Array 'a



module Data.Conversions where
  eitherToMaybe      :: (Either 'a 'b) => Maybe 'b
  eitherToValidation :: (Either 'a 'b) => Validation 'a 'b
  eitherToTask       :: (Either 'a 'b) => Task 'a 'b None

  maybeToEither     :: (Maybe 'a, 'b) => Either 'b 'a
  maybeToValidation :: (Maybe 'a, 'b) => Validation 'b 'a
  maybeToTask       :: (Maybe 'a, 'b) => Task 'b 'a None

  nullableToEither     :: ('a or None) => Either None 'a
  nullableToValidation :: ('a or None) => Validation None 'a

  validationToEither :: (Validation 'a 'b) => Either 'a 'b
  validationToMaybe  :: (Validation 'a 'b) => Maybe 'b
  validationToTask   :: (Validation 'a 'b) => Task 'a 'b None

  promiseToTask  :: (Promise 'a 'b) => Task 'b 'a None
  nodebackToTask :: (('a or None, 'b) => Void) => Task 'a 'b None



module Data.Either where
  type Either 'a 'b = Left 'a | Right 'b
  implements Functor 'b, Applicative 'b, Monad 'b, Setoid, Show

  (Either 'a 'b).get :: () => 'b -- throws with Left
  (Either 'a 'b).getOrElse :: ('b) => 'b
  (Either 'a 'b).orElse :: (('a) => Either 'c 'b) => Either 'c 'b
  (Either 'a 'b).fold :: (('a) => Either 'c 'd, ('b) => Either 'c 'd) => Either 'c 'd
  (Either 'a 'a).merge :: () => 'a
  (Either 'a 'b).swap :: () => Either 'b 'a
  (Either 'a 'b).bimap :: (('a) => 'c, ('b) => 'd) => Either 'c 'd
  (Either 'a 'b).leftMap :: (('a) => 'c) => Either 'c 'b

  (Either 'a 'b).toJSON :: () => JSON
  (Either 'a 'b).toString :: () => String

  (Either 'a 'b).toValidation :: () => Validation 'a 'b
  (Either 'a 'b).toMaybe :: () => Maybe 'b
  (Either 'a 'b).toTask :: () => Task 'a 'b None

   fromNullable :: ('a or None) => Either None 'a
   try :: (() => 'a - throws 'b) => Either 'b 'a



module Data.Maybe where
  type Maybe 'a = Nothing | Just 'a
  implements Functor 'b, Applicative 'b, Monad 'b, Setoid, Show

  (Maybe 'a).get :: () => 'a -- throws with Nothing
  (Maybe 'a).getOrElse :: ('b) => 'b
  (Maybe 'a).orElse :: (('a) => Maybe 'b) => Maybe 'b
  (Maybe 'a).fold :: (('a) => Maybe 'b, () => Maybe 'b) => Maybe 'b
  
  (Maybe 'a).toJSON :: () => JSON
  (Maybe 'a).toString :: () => String

  (Maybe 'a).toValidation :: ('b) => Validation 'b 'a
  (Maybe 'a).toEither :: ('b) => Either 'b 'a
  (Maybe 'a).toTask :: ('b) => Task 'b 'a None

  fromNullable :: ('a or None) => Maybe 'a



module Data.Validation where
  type Validation 'a 'b = Failure 'a | Success 'b
  implements Functor 'b, Applicative 'b, Setoid, Show

  (Validation 'a 'b).get :: () => 'b -- throws with Failure
  (Validation 'a 'b).getOrElse :: ('b) => 'b
  (Validation 'a 'b).orElse :: (('a) => Validation 'c 'b) => Validation 'c 'b
  (Validation 'a 'b).fold :: (('a) => Validation 'c 'd, ('b) => Validation 'c 'd) => Validation 'c 'd
  (Validation 'a 'a).merge :: () => 'a
  (Validation 'a 'b).swap :: () => Validation 'b 'a
  (Validation 'a 'b).bimap :: (('a) => 'c, ('b) => 'd) => Validation 'c 'd
  (Validation 'a 'b).failureMap :: (('a) => 'c) => Validation 'c 'b
  
  (Validation (Array 'a) 'b).concat :: (Validation (Array 'a) 'b) => Validation (Array 'a) 'b

  (Validation 'a 'b).toJSON :: () => JSON
  (Validation 'a 'b).toString :: () => String

  (Validation 'a 'b).toEither :: () => Either 'a 'b
  (Validation 'a 'b).toMaybe :: () => Maybe 'b
  (Validation 'a 'b).toTask :: () => Task 'a 'b None

   fromNullable :: ('a or None) => Validation None 'a
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

  (Task 'f 's 'r).run :: () => TaskExecution 'f 's 'r
  
  -- Common fantasy land methods (note that resources are consumed when tasks are transformed!)
  (Task 'f 's 'r).chain  :: (('s) => Task 'f 's2 'r2) => Task 'f 's2 'r2
  (Task 'f 's 'r).map    :: (('s) => 's2) => Task 'f 's2 None

  -- (Executes both in parallel using .and)
  (Task 'f (('a) => 'b) 'r).ap :: (Task 'f 'a 'r2) => Task 'f 'b None

  -- Constructing tasks
  Task.never    :: () => Task 'f 'a None -- Never resolves
  Task.of       :: ('a) => Task 'f 'a None
  Task.rejected :: ('a) => Task 'a 's None

  -- Combining tasks
  (Task 'f 's 'r).or      :: (Task 'f 's 'r2) => Task 'f 's None -- race
  (Task 'f 's 'r).orTry   :: (Task 'f 's 'r2) => Task (Array 'f) 's None -- first successful, fails if all fails
  (Task 'f 's 'r).and     :: (Task 'f 's2 'r2) => Task 'f ('s, 's2) None -- parallel
  (Task 'f 's 'r).andThen :: (Task 'f 's2 'r2) => Task 'f ('s, 's2) None -- sequential

  -- (These all work on non-empty arrays)
  race       :: (Array (Task 'f 's *)) => Task 'f 's None
  tryAll     :: (Array (Task 'f 's *)) => Task (Array 'f) 's None -- first successful, fail if all fails
  parallel   :: (Array (Task 'f 's *)) => Task 'f (Array 's) None
  sequential :: (Array (Task 'f 's *)) => Task 'f (Array 's) None  -- control.monads.sequence

  -- Other ops
  (Task 'f 's).recover      :: (('f) => Task 'f2 's 'r2) => Task 'f2 's 'r2
  (Task 'f 's).swap         :: () => Task 's 'f None
  (Task 'f 's).mapRejection :: (('f) => 'f2) => Task 'f2 's None
  (Task 'f 's).bimap        :: (('f) => 'f2, ('s) => 's2) => Task 'f2 's2 None

  
  (Task 'f 's).toString :: () => String 
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

  (TaskExecution 'f 's 'r).future  :: () => Future 'f 's
  (TaskExecution 'f 's 'r).promise :: () => Promise 'f 's
  (TaskExecution 'f 's 'r).cancel  :: () => Void
  (TaskExecution 'f 's 'r).listen  :: (DeferredListener 'f 's) => Void


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

  (Deferred 'f 's).resolve :: ('s) => Void
  (Deferred 'f 's).reject  :: ('f) => Void
  (Deferred 'f 's).cancel  :: () => Void
  (Deferred 'f 's).listen  :: (DeferredListener 'f 's) => Void
  (Deferred 'f 's).future  :: () => Future 'f 's
  (Deferred 'f 's).promise :: () => Promise 'f 's -- Native JS promise


  -- Future represents a future value, without the problems Promise has (not exported)
  type Future 'failure 'success = {
    state     :: ExecutionState 'failure 'success
    listeners :: Array (DeferredListener 'failure 'success)
  }
  implements Functor 'success, Monad 'success, Applicative 'success, Show

  (Future 'f 's).bimap        :: (('f) => 'f2, ('s) => 's2) => Future 'f2 's2
  (Future 'f 's).recover      :: (('f) => Future 'f2 's) => Future 'f2 's
  (Future 'f 's).swap         :: () => Future 's 'f
  (Future 'f 's).mapRejection :: (('f) => 'f2) => Future 'f2 's
  (Future 'f 's).toString     :: () => String
