const { Left, Right } = require('./either');


/*~
 * Converts nullable values to Eithers.
 * ---
 * category: Converting
 * stability: experimental
 * authors:
 *   - "@boris-marinov"
 * 
 * type: |
 *   (a or None) => Either None a
 */
const fromNullable = (a) =>
  a != null ? Right(a)
  :/*else*/   Left(a);


module.exports = fromNullable;
