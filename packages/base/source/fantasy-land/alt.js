//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

const { alt: flAlt } = require('folktale/helpers/fantasy-land');
const curry = require('folktale/core/lambda/curry');
const warn = require('folktale/helpers/warn-deprecated-method')('alt');
const unsupported = require('folktale/helpers/unsupported-method')('alt');

const isNew = (a) => typeof a[flAlt] === 'function';
const isOld = (a) => typeof a.alt === 'function';

/*~
 * stability: experimental
 * authors:
 *   - "@joshmili"
 *
 * type: |
 *   forall F, a:
 *     (F a, F a) => F a
 *   where F is Alt
 */
const alt = (aAlt, bAlt) =>
  isNew(bAlt)   ?  bAlt[flAlt](aAlt)
: isOld(aAlt)   ?  warn(aAlt.ap(bAlt))
: /*otherwise*/    unsupported(aAlt);


/*~
 * stability: experimental
 * authors:
 *   - "@joshmili"
 *
 * type: |
 *   forall F, a:
 *     (F a) => (F a) => F a
 *   where F is Alt
 */
alt.curried = curry(2, alt);    // eslint-disable-line no-magic-numbers


/*~
 * stability: experimental
 * authors:
 *   - "@joshmili"
 *
 * type: |
 *   forall F, a:
 *     (F a).(F a) => F a
 *   where F is Alt
 */
alt.infix = function(aAlt) {
  return alt(this, aAlt);
};


module.exports = alt;
