//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// See LICENCE for licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

const Task = require('./_task');

const noop = () => {};

const task = (computation, handlers = { onCancelled: noop, cleanup: noop }) =>
  Task(computation, handlers.onCancelled, handlers.cleanup);

module.exports = task;
