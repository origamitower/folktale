//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

const Task = require('./_task');
const waitAll = require('./wait-all');

/*~ 
 * stability: experimental 
 * name: module folktale/concurrency/task
 */
module.exports = {
  of: Task.of,
  rejected: Task.rejected,
  task: require('./task'),
  waitAny: require('./wait-any'),
  waitAll: waitAll,
  waitAll2: waitAll._2,
  waitAll3: waitAll._3,
  waitAll4: waitAll._4,
  waitAll5: waitAll._5,
  waitAll6: waitAll._6,
  do: require('./do'),
  _Task: Task,
  _TaskExecution: require('./_task-execution'),

  /*~
   * stability: experimental
   * type: |
   *    forall s, e:
   *      ((Any..., (e, s) => Void) => Void)
   *      => (Any...)
   *      => Task e s
   */
  fromNodeback(aNodeback) {
    return require('folktale/conversions/nodeback-to-task')(aNodeback);
  },

  /*~
   * stability: experimental
   * type: |
   *   forall e, v:
   *     ((Any...) => Promise v e) => (Any...) => Task e v
   */
  fromPromised(aPromiseFn) {
    return require('folktale/conversions/promised-to-task')(aPromiseFn);
  }
};
