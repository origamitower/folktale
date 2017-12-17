//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

const { Error, Ok } = require('folktale/result/result');


/*~
 * stability: stable
 * authors:
 *   - "@boris-marinov"
 * 
 * type: |
 *   forall a, b:
 *     (a or None, b) => Result b a
 *   & (a or None) => Result None a
 */
const nullableToResult = function(a, givenFallback) {
  const fallback = arguments.length > 1 ? givenFallback : a;
  return a != null ?  Ok(a)
  :      /* else */   Error(fallback);
};


module.exports = nullableToResult;
