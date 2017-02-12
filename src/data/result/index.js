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

  /*~
   * ---
   * category: Converting from other types
   * type: |
   *   forall a, b: (b or null) => Result a b
   */
  fromNullable(aNullable) {
    return require('folktale/data/conversions/nullable-to-result')(aNullable);
  },

  /*~
   * ---
   * category: Converting from other types
   * type: |
   *   forall a, b: (Validation a b) => Result a b
   */
  fromValidation(aValidation) {
    return require('folktale/data/conversions/validation-to-result')(aValidation);
  },

  /*~
   * ---
   * category: Converting from other types
   * type: |
   *   forall a, b: (Maybe b, a) => Result a b
   */
  fromMaybe(aMaybe, failureValue) {
    return require('folktale/data/conversions/maybe-to-result')(aMaybe, failureValue);
  }
};
