//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Copyright (C) 2015-2016 Quildreen Motta.
// Licensed under the MIT licence.
//
// See LICENCE for licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------


/*~
 * Implements common functional data structures in JavaScript.
 * ---
 * name: module folktale/data
 * category: Data Structures
 * stability: experimental
 */
module.exports = {
  conversions: require('./conversions'),
  maybe: require('./maybe'),
  either: require('./either'),
  validation: require('./validation'),
  future: require('./future'),
  task: require('./task')
};

