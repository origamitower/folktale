//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

const Task = require('./_task');

/*~ 
 * stability: experimental 
 * name: module folktale/data/task
 */
module.exports = {
  of: Task.of,
  rejected: Task.rejected,
  task: require('./task'),
  waitAny: require('./wait-any'),
  waitAll: require('./wait-all'),
  _Task: Task,
  _TaskExecution: require('./_task-execution'),

  /*~
   * type: |
   *    forall s, e, r:
   *    ((Any..., (e, s) => Void) => Void)
   *    => (Any...)
   *    => Task e s r
   */
  fromNodeback(aNodeback) {
    return require('folktale/data/conversions/nodeback-to-task')(aNodeback);
  }
};
