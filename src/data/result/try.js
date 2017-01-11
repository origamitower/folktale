const { Error, Ok } = require('./result');

/*~
 * Runs a function that may raise an exception, trapping it, and returning
 * an Result representing the result.
 * 
 * ## Example::
 * 
 *     function succ(nat) {
 *       if (nat < 0) {
 *         throw `Not a natural number: ${nat}`;
 *       } else {
 *         return nat + 1;
 *       }
 *     }
 * 
 *     const { Error, Ok } = require('folktale/data/result');
 *     
 *     _try(() => succ(-1));  // ==> Error('Not a natural number: -1')
 *     _try(() => succ(1));   // ==> Ok(2)
 * 
 * ---
 * category: Handling exceptions
 * stability: experimental
 * authors:
 *   - "@boris-marinov"
 * 
 * type: |
 *   forall a, b: (() => b :: throws a) => Result a b
 */
const _try = (f) => {
  try {
    return Ok(f());
  } catch (e) {
    return Error(e);
  }
};

module.exports = _try;
