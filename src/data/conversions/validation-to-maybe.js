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
 * Converts a Validation to a Maybe.
 * 
 * Failure values are lost in the process.
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
