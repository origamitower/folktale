/*
----------------------------------------------------------------------

 This source file is part of the Folktale project.

 Licensed under MIT. See LICENCE for full licence information.
 See CONTRIBUTORS for the list of contributors to the project.

----------------------------------------------------------------------
*/

import { just, nothing } from '../maybe/maybe';


/*~
 * stability: stable
 * authors:
 *   - Quildreen Motta
 *
 * type: |
 *   forall a:
 *     (a or None) => Maybe a
 */
export const nullableToMaybe = <A>(a: A | null) =>
  a != null ? just(a)
  :/*else*/   nothing();


module.exports = nullableToMaybe;
