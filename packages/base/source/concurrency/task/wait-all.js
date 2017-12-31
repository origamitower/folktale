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
  return tasks.reduce(
    (a, b) => a.and(b).map(([xs, x]) => [...xs, x]),
    of([])
  );
};


waitAll._2 = (a, b) => waitAll([a, b]);
waitAll._3 = (a, b, c) => waitAll([a, b, c]);
waitAll._4 = (a, b, c, d) => waitAll([a, b, c, d]);
waitAll._5 = (a, b, c, d, e) => waitAll([a, b, c, d, e]);
waitAll._6 = (a, b, c, d, e, f) => waitAll([a, b, c, d, e, f]);


module.exports = waitAll;
