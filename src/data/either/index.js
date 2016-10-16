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
 * Provides the Either data structure.
 * ---
 * name: module folktale/data/either
 * category: Handling failures
 */
module.exports = {
  ...require('./either'),
  try: require('./try'),
  fromNullable: require('folktale/data/conversions/nullable-to-either'),
  fromValidation: require('folktale/data/conversions/validation-to-either'),
  fromMaybe: require('folktale/data/conversions/maybe-to-either')
};
