//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

const { Just, Nothing } = require('folktale/maybe/maybe');


/*~
 * stability: stable
 * authors:
 *   - "@boris-marinov"
 *
 * type: |
 *   forall a, b:
 *     (Result a b) => Maybe b
 */
const resultToMaybe = (aResult) =>
  aResult.matchWith({
    Error: ({ value: _ }) => Nothing(),
    Ok: ({ value }) => Just(value)
  });


module.exports = resultToMaybe;

