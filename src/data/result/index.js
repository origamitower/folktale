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
 * name: module folktale/data/result
 * category: Modelling failures
 */
module.exports = {
  ...require('./result'),
  try: require('./try'),
  fromNullable: require('folktale/data/conversions/nullable-to-result'),
  fromValidation: require('folktale/data/conversions/validation-to-result'),
  fromMaybe: require('folktale/data/conversions/maybe-to-result')
};
