//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

const { Failure } = require('./validation');

/*~
 * stability: experimental
 * type: |
 *   forall a, b, c: (Validation a b, (b) => Validation a c) => Validation a c
 */
const chain = (validation, fn) =>
  validation.matchWith({
    Success: ({ value }) => fn(value),
    Failure: ({ value }) => Failure(value)
  })


module.exports = chain;