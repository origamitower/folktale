//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

const Validation = require('./validation');
const { typeSymbol } = require('folktale/adt/union/union');


/*~ 
 * stability: stable
 * name: module folktale/validation
 */
module.exports = {
  Success: Validation.Success,
  Failure: Validation.Failure,
  hasInstance: Validation.hasInstance,
  of: Validation.of,
  fromJSON: Validation.fromJSON,
  [typeSymbol]: Validation[typeSymbol],
  collect: require('./collect'),

  /*~
   * type: |
   *   forall a, b: (a or None, b) => Validation b a
   */
  fromNullable(aNullable, fallbackValue) {
    return require('folktale/conversions/nullable-to-validation')(aNullable, fallbackValue);
  },

  /*~
   * type: |
   *   forall a, b: (Result a b) => Validation a b
   */
  fromResult(aResult) {
    return require('folktale/conversions/result-to-validation')(aResult);
  },

  /*~
   * type: |
   *   forall a, b: (Maybe b, a) => Validation a b
   */
  fromMaybe(aMaybe, fallbackValue) {
    return require('folktale/conversions/maybe-to-validation')(aMaybe, fallbackValue);
  }
};
