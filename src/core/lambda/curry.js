//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// See LICENCE for licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

/*~
 * ---
 * category  : Currying and Partialisation
 * stability : experimental
 *
 * authors:
 *   - Quildreen Motta
 *
 * type: |
 *   (Number, (Any...) => 'a) => Any... => 'a or ((Any...) => 'a)
 */
const curry = (arity, fn) => {
  const curried = (oldArgs) => (...newArgs) => {
    const allArgs  = oldArgs.concat(newArgs);
    const argCount = allArgs.length;

    return argCount < arity   ?  curried(allArgs)
    :      /* otherwise */       fn(...allArgs);
  };

  return curried([]);
};


// --[ Exports ]-------------------------------------------------------
module.exports = curry;
