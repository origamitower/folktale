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
 * ---
 * name: module folktale/data/maybe
 * category: Modelling failures
 * authors:
 *   - "@boris-marinov"
 *   - Quildreen Motta
 */
module.exports = {
  ...require('./maybe'),
  fromResult: require('folktale/data/conversions/result-to-maybe'),
  fromValidation: require('folktale/data/conversions/validation-to-maybe')
};
