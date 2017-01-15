//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

const { Success, Failure } = require('folktale/data/validation/validation');


/*~
 * ---
 * category: Converting from nullables
 * stability: experimental
 * authors:
 *   - "@boris-marinov"
 * 
 * type: |
 *   forall a:
 *     (a or None) => Validation None a
 */
const nullableToValidation = (a) =>
  a != null ? Success(a)
  :/*else*/   Failure(a);


module.exports = nullableToValidation;
