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
 *     (Maybe a, b) => Validation b a
 */
const maybeToValidation = (aMaybe, failureValue) =>
  aMaybe.matchWith({
    Nothing: () => Failure(failureValue),
    Just:    ({ value }) => Success(value)
  });


module.exports = maybeToValidation;
