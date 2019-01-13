//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

const { task } = require('folktale/concurrency/task');


/*~
 * stability: experimental
 * type: |
 *   forall e, v, r:
 *     ((Any...) => Promise v e) => (Any...) => Task e v r
 */
const promisedToTask = (aPromiseFn) => {
  return (...args) => task(resolver => {
    const guard = (fn) => (value) => {
      if (!resolver.isCancelled) fn(value);
    };

    aPromiseFn(...args).then(
      guard((value) => resolver.resolve(value)),
      guard((error) => resolver.reject(error))
    );
  });
};

module.exports = promisedToTask;
