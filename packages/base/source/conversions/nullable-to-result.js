//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

const { Error, Ok } = require('folktale/result/result');
const deprecated = require('folktale/helpers/warn-deprecation');


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
  const oldBehaviour = arguments.length < 2;
  if (oldBehaviour) {
    deprecated(`nullableToResult(value) is being deprecated in favour of providing an explicit fallback value.
nullableToResult(value, fallback) is the new preferred form of this function.
`);
  }

  const fallback = oldBehaviour ? a : givenFallback;
  return a != null ?  Ok(a)
  :      /* else */   Error(fallback);
};


module.exports = nullableToResult;
