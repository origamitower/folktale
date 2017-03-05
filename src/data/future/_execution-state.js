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

/*~ stability: experimental */
const ExecutionState = data('folktale:ExecutionState', {
  /*~*/
  Pending() {
    return {};
  },

  /*~*/
  Cancelled() {
    return {};
  },

  /*~*/
  Resolved(value) {
    return { value };
  },

  /*~*/
  Rejected(reason) {
    return { reason };
  }
}).derive(show, setoid);


// --[ Exports ]-------------------------------------------------------
module.exports = ExecutionState;
