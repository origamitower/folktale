//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

const { of } = require('./_task');

/*~
 * stability: experimental
 * type: |
 *   forall v, e: ([Task e v Any]) => Task e [v] Any
 */
const waitAll = (tasks) => {
  if (tasks.length === 0) {
    throw new Error('Task.waitAll() requires a non-empty array of tasks.');
  }

  return tasks.reduce(
    (a, b) => a.and(b).map(([xs, x]) => [...xs, x]),
    of([])
  );
};

module.exports = waitAll;
