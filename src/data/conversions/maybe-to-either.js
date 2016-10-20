//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Copyright (C) 2015-2016 Quildreen Motta.
// Licensed under the MIT licence.
//
// See LICENCE for licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

const { Left, Right } = require('folktale/data/either/either');


/*~
 * Converts a `Maybe` to an `Either`. `Nothing`s map to `Left`s, `Just`s map to
 * `Right`s.
 * 
 * Note that since `Maybe`s don't hold a value for failures in the `Nothing` tag, 
 * you must provide one to this function.
 * 
 * 
 * ## Example::
 * 
 *     const { Left, Right } = require('folktale/data/either');
 *     const { Nothing, Just } = require('folktale/data/maybe');
 * 
 *     maybeToEither(Nothing(), 2); // ==> Left(2)
 *     maybeToEither(Just(1), 2);   // ==> Right(1)
 * 
 * ---
 * category: Converting from Maybe
 * stability: experimental
 * authors:
 *   - "@boris-marinov"
 * 
 * type: |
 *   forall a, b:
 *     (Maybe a, b) => Either b a
 */
const maybeToEither = (aMaybe, failureValue) =>
  aMaybe.matchWith({
    Nothing: () => Left(failureValue),
    Just:    ({ value }) => Right(value)
  });


module.exports = maybeToEither;
