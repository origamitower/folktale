//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// See LICENCE for licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

const mapValues = require('folktale/core/object/map-values');
const curry = require('folktale/core/lambda/curry');

/*~
 * Allows invoking methods of Fantasy Land structures without
 * worrying about the differences in multiple versions of the spec.
 * ---
 * category: Fantasy Land
 * stability: experimental
 * authors:
 *   - "@boris-marinov"
 */
module.exports = mapValues(require('./core'), (f) => curry(f.length, f));
