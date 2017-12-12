//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

const { Error, Ok } = require('folktale/result/result');


/*~
 * stability: stable
 * authors:
 *   - "@boris-marinov"
 * 
 * type: |
 *   forall a:
 *     (a or None) => Result None a
 */
const nullableToResult = (a) =>
  a != null ? Ok(a)
  :/*else*/   Error(a);


module.exports = nullableToResult;
