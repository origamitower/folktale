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
 * type: |
 *   forall v, e: (GeneratorInstance [Task e v Any]) => Any => Task e [v] Any
 */
const runGenerator = (generator, value) => (resolver) => {
  const { value: task, done } = generator.next(value);
  task.run().listen({
    onCancelled: resolver.cancel,
    onResolved: (result) => 
      !done ? runGenerator(generator, result)(resolver)
      :       resolver.resolve(result),
    onRejected: resolver.reject
  });
};

/*~
 * stability: experimental
 * type: |
 *   forall v, e: (Generator [Task e v Any]) => Task e [v] Any
 */
const taskDo = generator => new Task(runGenerator(generator()));

module.exports = taskDo;
