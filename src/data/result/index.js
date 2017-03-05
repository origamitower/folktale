//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------


/*~
 * stability: experimental
 */
module.exports = {
  ...require('./result'),
  try: require('./try'),

  /*~
   * type: |
   *   forall a: (a or None) => Result None a
   */
  fromNullable(aNullable) {
    return require('folktale/data/conversions/nullable-to-result')(aNullable);
  },

  /*~
   * type: |
   *   forall a, b: (Validation a b) => Result a b
   */
  fromValidation(aValidation) {
    return require('folktale/data/conversions/validation-to-result')(aValidation);
  },

  /*~
   * type: |
   *   forall a, b: (Maybe b, a) => Result a b
   */
  fromMaybe(aMaybe, failureValue) {
    return require('folktale/data/conversions/maybe-to-result')(aMaybe, failureValue);
  }
};
