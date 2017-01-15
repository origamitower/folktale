//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

const raise = (error) => { throw error };

const defer = typeof setImmediate !== 'undefined' ?  (f) => setImmediate(f)
            : typeof process !== 'undefined'      ?  (f) => process.nextTick(f)
            : /* otherwise */                        (f) => setTimeout(f, 0);

module.exports = defer;