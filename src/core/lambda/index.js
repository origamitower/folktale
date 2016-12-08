//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// See LICENCE for licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

/*~
 * ---
 * name     : module folktale/core/lambda
 * category : Lambda Calculus
 */
module.exports = {
  identity: require('./identity'),
  constant: require('./constant'),
  curry: require('./curry'),
  compose: require('./compose'),
  partialise: require('./partialise')
};
