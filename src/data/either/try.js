const { Left, Right } = require('./either');

/*~
 * Runs a function that may raise an exception, trapping it, and returning
 * an Either representing the result.
 * ---
 * category: Handling exceptions
 * stability: experimental
 * authors:
 *   - "@boris-marinov"
 * 
 * type: |
 *   forall a, b: ((Any...) => b :: throws a) => Either a b
 */
const _try = (f) => (...args) => {
  try {
    return Right(f(...args));
  } catch (e) {
    return Left(e);
  }
};

module.exports = _try;
