const { Left, Right } = require('./either');

/*~
 * Runs a function that may raise an exception, trapping it, and returning
 * an Either representing the result.
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
 *     const { Left, Right } = require('folktale/data/either');
 *     
 *     _try(() => succ(-1));  // ==> Left('Not a natural number: -1')
 *     _try(() => succ(1));   // ==> Right(2)
 * 
 * ---
 * category: Handling exceptions
 * stability: experimental
 * authors:
 *   - "@boris-marinov"
 * 
 * type: |
 *   forall a, b: (() => b :: throws a) => Either a b
 */
const _try = (f) => {
  try {
    return Right(f());
  } catch (e) {
    return Left(e);
  }
};

module.exports = _try;
