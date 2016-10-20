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
 * Converts an `Either` structure to a Maybe structure. `Left`s map to `Nothing`s,
 * `Right`s map to `Just`s.
 * 
 * Not that `Left` values are lost in the conversion process, since failures
 * in `Maybe` (the `Nothing` tag) don't have a value.
 * 
 * ## Example::
 * 
 *     const { Left, Right } = require('folktale/data/either');
 *     const { Just, Nothing } = require('folktale/data/maybe');
 *     eitherToMaybe(Left(1));  // ==> Nothing()
 *     eitherToMaybe(Right(1)); // ==> Just(1) 
 * 
 * ---
 * category: Converting from Either
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

