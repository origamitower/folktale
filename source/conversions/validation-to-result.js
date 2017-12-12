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
 *   forall a, b:
 *      (Validation a b) => Result a b
 */
const validationToResult = (aValidation) =>
  aValidation.matchWith({
    Failure: ({ value }) => Error(value),
    Success: ({ value }) => Ok(value)
  });


module.exports = validationToResult;
