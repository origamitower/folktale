//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

const hole = {};


/*~
 * ---
 * since     : v2.0.0
 * category  : Currying and Partialisation
 * stability : experimental
 * authors:
 *   - Quildreen Motta
 *
 * type: |
 *   (Number, (Any... => Any)) => ((hole | Any)...) => Any :: (throw TypeError)
 */
const partialise = (arity, fn) => (...args) => { 
  /* eslint-disable no-magic-numbers */
  if (args.length < arity) {
    throw new TypeError(`The partial function takes at least ${arity} arguments, but was given ${args.length}.`);
  }

  // Figure out if we have holes
  let holes = 0;
  for (let i = 0; i < args.length; ++i) {
    if (args[i] === hole) {
      holes += 1;
    }
  }


  if (holes > 0) {
    return partialise(holes, (...newArgs) => {
      let realArgs = [];
      let argIndex = 0;

      for (let i = 0; i < args.length; ++i) {
        const arg = args[i];
        if (arg === hole) {
          realArgs.push(newArgs[argIndex]);
          argIndex += 1;
        } else {
          realArgs.push(arg);
        }
      }

      return fn(...realArgs);
    });
  } else {
    return fn(...args);
  }
}; /* eslint-enable no-magic-numbers */


// ---[ Special Values ]-----------------------------------------------
/*~
 * ---
 * category: Special Values
 */
partialise.hole = hole;


// --[ Exports ]-------------------------------------------------------
module.exports = partialise;
