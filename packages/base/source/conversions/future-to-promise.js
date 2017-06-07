//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

const { Cancelled } = require('folktale/concurrency/future/_execution-state');


/*~
 * stability: experimental
 * type: |
 *   forall e, v:
 *     (Future e v) => Promise v e
 */
const futureToPromise = (aFuture) => {
  return new Promise((resolve, reject) => {
    aFuture.listen({
      onResolved: (value) => resolve(value),
      onRejected: (error) => reject(error),
      onCancelled: ()     => reject(Cancelled())
    });
  });
};

module.exports = futureToPromise;
