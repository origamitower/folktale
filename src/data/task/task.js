//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

const Task = require('./_task');

const noop = () => {};

/*~ stability: experimental */
const task = (computation, handlers = { onCancelled: noop, cleanup: noop }) =>
  new Task(computation, handlers.onCancelled, handlers.cleanup);

module.exports = task;
