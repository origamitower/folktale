//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

/*~
 * stability: experimental
 * authors:
 *   - Quildreen Motta
 *
 * type: |
 *   (Number, (Any...) => 'a) => Any... => 'a or ((Any...) => 'a)
 */
const curry = (fn) => {
  const arity = fn.length;
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
