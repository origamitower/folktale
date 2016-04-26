//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// See LICENCE for licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

/*~
 * Essential building blocks and compositional operations which are
 * likely to be used by most programs are provided by this module.
 *
 * These operations usually don't fit in more specific categories,
 * like `data`, or provide a better alternative to functionality
 * that's already provided by the language itself.
 *
 * --------------------------------------------------------------------
 * name        : module folktale/core
 * module      : folktale/core
 * copyright   : (c) 2015-2016 Quildreen Motta, and CONTRIBUTORS
 * licence     : MIT
 * repository  : https://github.com/origamitower/folktale
 *
 * category    : Essential Operations
 *
 * maintainers:
 *   - Quildreen Motta <queen@robotlolita.me>
 */
module.exports = {
  lambda: require('./lambda'),
  adt: require('./adt'),
  object: require('./object')
};
