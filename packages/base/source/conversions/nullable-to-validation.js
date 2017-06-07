//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

const { Success, Failure } = require('folktale/validation/validation');


/*~
 * stability: stable
 * authors:
 *   - "@boris-marinov"
 * 
 * type: |
 *   forall a, b:
 *     (a or None, b) => Validation b a
 */
const nullableToValidation = (a, fallbackValue) =>
  a != null ?  Success(a)
  :/*else*/    Failure(fallbackValue);


module.exports = nullableToValidation;
