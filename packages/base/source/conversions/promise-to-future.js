//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

const { Cancelled } = require('folktale/concurrency/future/_execution-state');
const Deferred = require('folktale/concurrency/future/_deferred');

/*~
 * stability: experimental
 * type: |
 *   forall e, v:
 *     (Promise v e) => Future e v
 */
const promiseToFuture = (aPromise) => {
  const deferred = new Deferred();
  aPromise.then(
    (value) => deferred.resolve(value),
    (error) => {
      if (Cancelled.hasInstance(error)) {
        deferred.cancel();
      } else {
        deferred.reject(error);
      }
    }
  );
  return deferred.future();
};


module.exports = promiseToFuture;
