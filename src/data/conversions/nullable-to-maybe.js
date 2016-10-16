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
 * Converts a nullable value to a maybe.
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