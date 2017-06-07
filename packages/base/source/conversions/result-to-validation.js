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
 *     (Result a b) => Validation a b
 */
const resultToValidation = (aResult) =>
  aResult.matchWith({
    Error: ({ value }) => Failure(value),
    Ok: ({ value }) => Success(value)
  });


module.exports = resultToValidation;
