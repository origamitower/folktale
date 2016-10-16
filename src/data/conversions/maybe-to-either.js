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
 * Converts a Maybe to an Either.
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
