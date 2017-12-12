//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

// --[ Dependencies ]--------------------------------------------------
const { union, derivations } = require('folktale/adt/union');

const { equality, debugRepresentation } = derivations;


// --[ Implementation ]------------------------------------------------

/*~ stability: experimental */
const ExecutionState = union('folktale:ExecutionState', {
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
