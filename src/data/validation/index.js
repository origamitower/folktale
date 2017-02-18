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

  /*~
   * ---
   * category: Converting from other types
   * type: |
   *   forall a: (a or None) => Validation None a
   */
  fromNullable(aNullable) {
    return require('folktale/data/conversions/nullable-to-validation')(aNullable);
  },

  /*~
   * category: Converting from other types
   * type: |
   *   forall a, b: (Result a b) => Validation a b
   */
  fromResult(aResult) {
    return require('folktale/data/conversions/result-to-validation')(aResult);
  },

  /*~
   * category: Converting from other types
   * type: |
   *   forall a, b: (Maybe b, a) => Validation a b
   */
  fromMaybe(aMaybe) {
    return require('folktale/data/conversions/maybe-to-validation')(aMaybe);
  }
};
