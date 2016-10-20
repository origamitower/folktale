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

const { Just, Nothing } = require('folktale/data/maybe/maybe');


/*~
 * Converts a `Validation` to a `Maybe`. `Failure`s map to `Nothing`s,
 * `Success`es map to `Just`s.
 * 
 * `Failure` values are lost in the process, since the `Nothing` tag can't
 * hold any values.
 * 
 * 
 * ## Example::
 * 
 *     const { Failure, Success } = require('folktale/data/validation');
 *     const { Nothing, Just } = require('folktale/data/maybe');
 * 
 *     validationToMaybe(Failure(1));  // ==> Nothing()
 *     validationToMaybe(Success(1));  // ==> Just(1)
 * 
 * ---
 * category: Converting from Validation
 * stability: experimental
 * authors: 
 *   - "@boris-marinov"
 * 
 * type: |
 *   forall a, b:
 *     (Validation a b) => Maybe b
 */
const validationToMaybe = (aValidation) =>
  aValidation.matchWith({
    Failure:  () => Nothing(),
    Success:  ({ value }) => Just(value)
  });


module.exports = validationToMaybe;
