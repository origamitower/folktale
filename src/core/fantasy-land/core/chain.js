//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// See LICENCE for licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

const { chain:flChain } = require('folktale/helpers/fantasy-land');
const warn = require('folktale/helpers/warn-deprecated')('chain');
const unsupported = require('folktale/helpers/unsupported-method')('chain');


/*~
 * Transforms a monad with an unary function.
 * ---
 * category: Fantasy Land
 * stability: experimental
 * authors:
 *   - "@boris-marinov"
 * 
 * type: |
 *   forall C, a, b:
 *     ((a) => C b, C a) => C b
 *   where C is Chain
 */
const chain = (f, a) =>
  typeof a[flChain] === 'function' ?  a[flChain](f)
: typeof a.chain  === 'function'   ?  warn(a.chain(f))
: /*otherwise*/                       unsupported(a);


module.exports = chain;
