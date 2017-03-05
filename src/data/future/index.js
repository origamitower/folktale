//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

const Future = require('./_future');

/*~
 * stability: experimental
 */
module.exports = {
  of: Future.of,
  rejected: Future.rejected,
  _Deferred: require('./_deferred'),
  _ExecutionState: require('./_execution-state'),
  _Future: Future
};
