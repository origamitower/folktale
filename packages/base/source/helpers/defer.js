//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

/* eslint-disable no-magic-numbers, max-statements-per-line */
const defer = typeof setImmediate !== 'undefined' ?  (f) => setImmediate(f)
            : typeof process !== 'undefined'      ?  (f) => process.nextTick(f)
            : /* otherwise */                        (f) => setTimeout(f, 0);
/* eslint-enable no-magic-numbers, max-statements-per-line */

module.exports = defer;
