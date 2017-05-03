//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

// --[ Dependencies ]--------------------------------------------------
const { data, derivations } = require('folktale/core/adt');

const { equality, debugRepresentation } = derivations;


// --[ Implementation ]------------------------------------------------

/*~ stability: experimental */
const ExecutionState = data('folktale:ExecutionState', {
  /*~
   */
  Pending() {
    return {};
  },

  /*~
   */
  Cancelled() {
    return {};
  },

  /*~
   */
  Resolved(value) {
    return { value };
  },

  /*~
   */
  Rejected(reason) {
    return { reason };
  }
}).derive(equality, debugRepresentation);


// --[ Exports ]-------------------------------------------------------
module.exports = ExecutionState;
