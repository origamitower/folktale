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
 * ---
 * category: Converting from Result
 * stability: experimental
 * authors:
 *   - "@boris-marinov"
 *
 * type: |
 *   forall a, b:
 *     (Result a b) => Maybe b
 */
const resultToMaybe = (aResult) =>
  aResult.matchWith({
    Error: ({ value }) => Nothing(),
    Ok: ({ value }) => Just(value)
  });


module.exports = resultToMaybe;

