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
const { Success, Failure } = require('folktale/data/validation/validation');


/*~
 * Converts a nullable value to a `Validation`. `null` and `undefined`
 * map to `Failure`s, any other type maps to `Success`es.
 * 
 * A nullable is a value that may be any type, or `null`/`undefined`.
 * 
 * 
 * ## Example::
 * 
 *     const { Failure, Success } = require('folktale/data/validation');
 *     nullableToValidation(undefined); // ==> Failure(undefined)
 *     nullableToValidation(null);      // ==> Failure(null)
 *     nullableToValidation(1);         // ==> Success(1)
 * 
 * ---
 * category: Converting from nullables
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
