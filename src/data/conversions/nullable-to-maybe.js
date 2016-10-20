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

const { Nothing, Just } = require('folktale/data/maybe/maybe');


/*~
 * Converts a nullable value to a maybe. `null` and `undefined` map to
 * `Nothing`, any other value maps to `Just`s.
 * 
 * A nullable is a value that may be any type, or `null`/`undefined`. Since
 * `Nothing` can't hold values, it's not possible to differentiate whether
 * the original value was `null` or `undefined` after the conversion.
 * 
 * ## Example::
 * 
 *     const { Nothing, Just } = require('folktale/data/maybe');
 * 
 *     nullableToMaybe(undefined);  // ==> Nothing()
 *     nullableToMaybe(null);       // ==> Nothing()
 *     nullableToMaybe(1);          // ==> Just(1)
 * 
 * ---
 * category: Converting from nullables
 * stability: experimental
 * authors:
 *   - Quildreen Motta
 * 
 * type: |
 *   forall a:
 *     (a or None) => Maybe a
 */
const nullableToMaybe = (a) =>
  a != null ? Just(a)
  :/*else*/   Nothing();


module.exports = nullableToMaybe;