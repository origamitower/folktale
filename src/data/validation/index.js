//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

module.exports = {
  ...require('./validation'),
  fromNullable: require('folktale/data/conversions/nullable-to-validation'),
  fromResult: require('folktale/data/conversions/result-to-validation'),
  fromMaybe: require('folktale/data/conversions/maybe-to-validation')
};
