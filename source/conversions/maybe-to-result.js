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
 *     (Maybe a, b) => Result b a
 */
const maybeToResult = (aMaybe, failureValue) =>
  aMaybe.matchWith({
    Nothing: () => Error(failureValue),
    Just: ({ value }) => Ok(value)
  });


module.exports = maybeToResult;
