//---------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// See LICENCE for licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//---------------------------------------------------------------------

const Future = require('./_future');

/*~
 * Objects for working with eventual values.
 * 
 * ---
 * name: module folktale/data/future
 * category: Asynchronous Concurrency
 */
module.exports = {
  ...Future,
  Deferred: require('./deferred'),
  _ExecutionState: require('./_execution-state'),
  _Future: Future
};
