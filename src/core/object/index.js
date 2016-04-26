//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// See LICENCE for licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

/*~
 * Provides missing utilities for handling objects as dictionaries.
 *
 *
 * ## Why?
 *
 * Idiomatic JS code tends to use plain objects as records or dictionaries,
 * but there aren't many native facilities for handling them in that way.
 * This module tries to fill that gap.
 *
 * ---------------------------------------------------------------------
 * name        : module folktale/core/object
 * module      : folktale/core/object
 * copyright   : (c) 2015-2016 Quildreen Motta, and CONTRIBUTORS
 * licence     : MIT
 * repository  : https://github.com/origamitower/folktale
 *
 * category    : Utilities for Native Objects
 *
 * maintainers:
 *   - Quildreen Motta <queen@robotlolita.me>
 */
module.exports = {
  infix: require('./infix'),
  mapEntries: require('./map-entries'),
  mapValues: require('./map-values'),
  values: require('./values'),
  toPairs: require('./to-pairs'),
  fromPairs: require('./from-pairs')
};
