//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

const define = Object.defineProperty;


/*~
 * stability: stable
 * authors:
 *   - Quildreen Motta
 *
 * complexity : O(n), n is the length of the array
 * type: |
 *   (Array (String or Symbol, 'a)) => Object 'a
 */
const fromPairs = (pairs) =>
        pairs.reduce((r, [k, v]) => define(r, k, { value: v,
                                                   writable: true,
                                                   enumerable: true,
                                                   configurable: true
                                                  }),
                     {});


// --[ Exports ]-------------------------------------------------------
module.exports = fromPairs;
