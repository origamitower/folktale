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

const { Success, Failure } = require('folktale/data/validation/validation');


/*~
 * Converts an `Either` to a `Validation`. `Left`s map to `Failure`s, `Right`s map
 * to `Success`es.
 * 
 * 
 * ## Example::
 * 
 *     const { Left, Right } = require('folktale/data/either');
 *     const { Failure, Success } = require('folktale/data/validation');
 * 
 *     eitherToValidation(Left(1));  // ==> Failure(1)
 *     eitherToValidation(Right(1)); // ==> Success(1)
 * 
 * ---
 * category: Converting from Either
 * stability: experimental
 * authors:
 *   - "@boris-marinov"
 * 
 * type: |
 *   forall a, b:
 *     (Either a b) => Validation a b
 */
const eitherToValidation = (anEither) =>
  anEither.matchWith({
    Left:  ({ value }) => Failure(value),
    Right: ({ value }) => Success(value)
  });


module.exports = eitherToValidation;
