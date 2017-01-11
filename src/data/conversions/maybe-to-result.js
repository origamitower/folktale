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

const { Error, Ok } = require('folktale/data/result/result');


/*~
 * ---
 * category: Converting from Maybe
 * stability: experimental
 * authors:
 *   - "@boris-marinov"
 * 
 * type: |
 *   forall a, b:
 *     (Maybe a, b) => Result b a
 */
const maybeToResult = (aMaybe, failureValue) =>
  aMaybe.matchWith({
    Nothing: () => Error(failureValue),
    Just: ({ value }) => Ok(value)
  });


module.exports = maybeToResult;
