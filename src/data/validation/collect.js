//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------


const { Success } = require('./validation');


/*~
 * stability: experimental
 * type: |
 *   forall a, b: (Array (Validation a b)) => Validation a b
 *   where a is Semigroup
 */
const collect = (validations) =>
  validations.reduce((a, b) => a.concat(b), Success());


module.exports = collect;
