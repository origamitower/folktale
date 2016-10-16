
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
 * Converts a Validation to an Either.
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
