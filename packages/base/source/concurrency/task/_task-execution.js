//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

/*~ stability: experimental */
class TaskExecution {
  /*~*/
  constructor(task, deferred) {
    this._task = task;
    this._deferred = deferred;
    this._links = [];
  }

  /*~*/
  cancel() {
    this._deferred.maybeCancel();
    this._links.forEach(link => link.cancel());
    return this;
  }

  /*~*/
  listen(pattern) {
    this._deferred.listen(pattern);
    return this;
  }

  /*~*/
  promise() {
    return this._deferred.promise();
  }

  /*~*/
  future() {
    return this._deferred.future();
  }

  /*~*/
  link(execution) {
    this._links.push(execution);
    return this;
  }
}

module.exports = TaskExecution;
