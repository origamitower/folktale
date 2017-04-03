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
  ...Task,
  task: require('./task'),
  waitAny: require('./race'),
  waitAll: require('./parallel'),
  _Task: Task,
  _TaskExecution: require('./_task-execution')
};
