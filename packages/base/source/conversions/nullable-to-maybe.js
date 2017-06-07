//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

const { Nothing, Just } = require('folktale/maybe/maybe');


/*~
 * stability: stable
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
