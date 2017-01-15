//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

// --[ Dependencies ]--------------------------------------------------
const { data, show, setoid } = require('folktale/core/adt');


// --[ Implementation ]------------------------------------------------

/*~
 * Describes the current state of a task execution/deferred/future.
 */
const ExecutionState = data('folktale:ExecutionState', {
  /*~
   * Not yet resolved.
   */
  Pending() {
    return {};
  },

  /*~
   * Resolved as cancelled.
   */
  Cancelled() {
    return {};
  },

  /*~
   * Resolved successfully, with a value.
   */
  Resolved(value) {
    return { value };
  },

  /*~
   * Resolved as a failure, with a reason.
   */
  Rejected(reason) {
    return { reason };
  }
}).derive(show, setoid);


// --[ Exports ]-------------------------------------------------------
module.exports = ExecutionState;
