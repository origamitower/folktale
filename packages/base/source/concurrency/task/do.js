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
const nextGeneratorValue = (generator) => (value) => {
  const { value: task, done } = generator.next(value);
  return !done ? task.chain(nextGeneratorValue(generator))
    /* else */ : task;
}

/*~
 * stability: experimental
 * type: |
 *   forall v, e: (Generator [Task e v Any]) => Task e [v] Any
 */
const taskDo = (generator) => 
  new Task((resolver) => resolver.resolve(generator()))
    .chain((generator) => nextGeneratorValue(generator)());

module.exports = taskDo;
