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

const { Just, Nothing } = require('folktale/data/maybe/core');


/*~
 * Converts an Either structure to a Maybe structure.
 * 
 * Left values are lost in the process.
 * ---
 * category: Converting data
 * stability: experimental
 * authors:
 *   - "@boris-marinov"
 * 
 * type: |
 *   forall a, b:
 *     (Either a b) => Maybe b
 */
const eitherToMaybe = (anEither) =>
  anEither.matchWith({
    Left:  () => Nothing(),
    Right: ({ value }) => Just(value)
  });


module.exports = eitherToMaybe;

