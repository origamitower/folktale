//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

/*~
 * ---
 * name: module folktale/data/conversions
 * category: Converting data
 * stability: experimental
 */
module.exports = {
  resultToValidation: require('./result-to-validation'),
  resultToMaybe: require('./result-to-maybe'),
  validationToResult: require('./validation-to-result'),
  validationToMaybe: require('./validation-to-maybe'),
  maybeToValidation: require('./maybe-to-validation'),
  maybeToResult: require('./maybe-to-result'),
  nullableToValidation: require('./nullable-to-validation'),
  nullableToResult: require('./nullable-to-result'),
  nullableToMaybe: require('./nullable-to-maybe')
};

