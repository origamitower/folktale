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

/*~
 * stability: experimental
 * type: |
 *   forall value, reason:
 *     (
 *       ({
 *          resolve: (value) => Void,
 *          reject: (reason) => Void,
 *          cancel: () => Void,
 *          cleanup: (() => Void) => Void,
 *          onCancelled: (() => Void) => Void,
 *          get isCancelled: Boolean
 *        }) => Void
 *     ) => Task reason value
 */
const task = (computation) =>
  new Task(computation);


module.exports = task;
