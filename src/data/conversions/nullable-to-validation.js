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
const { Success, Failure } = require('folktale/data/validation/core');


/*~
 * Converts a nullable value to a Validation.
 * ---
 * category: Converting data
 * stability: experimental
 * authors:
 *   - "@boris-marinov"
 * 
 * type: |
 *   forall a:
 *     (a or None) => Validation None a
 */
const nullableToValidation = (a) =>
  a != null ? Success(a)
  :/*else*/   Failure(a);


module.exports = nullableToValidation;
