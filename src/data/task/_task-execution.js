//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// See LICENCE for licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

class TaskExecution {
  constructor(task, deferred) {
    this._task = task;
    this._deferred = deferred;
  }

  cancel() {
    this._deferred.maybeCancel();
    return this;
  }

  listen(pattern) {
    this._deferred.listen(pattern);
    return this;
  }

  promise() {
    return this._deferred.promise();
  }

  future() {
    return this._deferred.future();
  }
}

module.exports = TaskExecution;
