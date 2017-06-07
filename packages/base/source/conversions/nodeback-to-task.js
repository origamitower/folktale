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
 * authors:
 *   - "@rpearce"
 * type: |
 *    forall s, e, r:
 *    ((Any..., (e, s) => Void) => Void)
 *    => (Any...)
 *    => Task e s r
 */

const nodebackToTask = fn => (...args) => (
  task(r =>
    fn(...args, (err, data) => err ? r.reject(err) : r.resolve(data))
  )
);

module.exports = nodebackToTask;
