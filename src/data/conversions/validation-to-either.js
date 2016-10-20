
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
 * Converts a `Validation` to an `Either`. `Failure`s map to `Left`s,
 * `Success`es map to `Right`s.
 * 
 * ## Example::
 * 
 *     const { Left, Right } = require('folktale/data/either');
 *     const { Failure, Success } = require('folktale/data/validation');
 * 
 *     validationToEither(Failure(1));  // ==> Left(1)
 *     validationToEither(Success(1));  // ==> Right(1) 
 * 
 * ---
 * category: Converting from Validation
 * stability: experimental
 * authors:
 *   - "@boris-marinov"
 * 
 * type: |
 *   forall a, b:
 *      (Validation a b) => Either a b
 */
const validationToEither = (aValidation) =>
  aValidation.matchWith({
    Failure: ({ value }) => Left(value),
    Success: ({ value }) => Right(value)
  });


module.exports = validationToEither;
