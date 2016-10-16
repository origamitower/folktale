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

const { Success, Failure } = require('folktale/data/validation/core');


/*~
 * Converts an Either to a Validation.
 * ---
 * category: Converting data
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
