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
 * Converts a `Maybe` to a `Validation`. `Nothing`s map to `Failure`s, `Just`s map
 * to `Success`es.
 * 
 * Note that since `Maybe` failures can't hold a value in the `Nothing` tag, you 
 * must provide one for the validation.
 * 
 * ## Example::
 * 
 *     const { Failure, Success } = require('folktale/data/validation');
 *     const { Nothing, Just } = require('folktale/data/maybe');
 * 
 *     maybeToValidation(Nothing(), 2);  // ==> Failure(2)
 *     maybeToValidation(Just(1), 2);    // ==> Success(1)
 * 
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
