//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

const { chain: flChain } = require('folktale/helpers/fantasy-land');
const curry = require('folktale/core/lambda/curry');
const warn = require('folktale/helpers/warn-deprecated-method')('chain');
const unsupported = require('folktale/helpers/unsupported-method')('chain');

const isNew = (a) => typeof a[flChain] === 'function';
const isOld = (a) => typeof a.chain === 'function';


/*~
 * stability: experimental
 * authors:
 *   - "@boris-marinov"
 *   - Quildreen Motta
 * 
 * type: |
 *   forall C, a, b:
 *     (C a, (a) => C b) => C b
 *   where C is Chain
 */
const chain = (monad, transformation) =>
  isNew(monad) ?  monad[flChain](transformation)
: isOld(monad) ?  warn(monad.chain(transformation))
: /*otherwise*/   unsupported(monad);


/*~
 * stability: experimental
 * authors:
 *   - "@boris-marinov"
 *   - Quildreen Motta
 * 
 * type: |
 *   forall C, a, b:
 *     ((a) => C b) => (C a) => C b
 *   where C is Chain
 */
chain.curried = curry(2, (transformation, monad) =>   // eslint-disable-line no-magic-numbers
  chain(monad, transformation)
);


/*~
 * stability: experimental
 * authors:
 *   - Quildreen Motta
 * 
 * type: |
 *   forall C, a, b:
 *     (C a).((a) => C b) => C b
 *   where C is Chain
 */
chain.infix = function(transformation) {
  return chain(this, transformation);
};


module.exports = chain;
