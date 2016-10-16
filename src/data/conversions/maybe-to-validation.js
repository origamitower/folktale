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
 * Converts a Maybe to a Validation.
 * ---
 * category: Converting from Maybe
 * stability: experimental
 * authors:
 *   - "@boris-marinov"
 * 
 * type: |
 *   forall a, b:
 *     (Maybe a, b) => Validation b a
 */
const maybeToValidation = (aMaybe, failureValue) =>
  aMaybe.matchWith({
    Nothing: () => Failure(failureValue),
    Just:    ({ value }) => Success(value)
  });


module.exports = maybeToValidation
