//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------


const Maybe = require('./maybe');
const { typeSymbol } = require('folktale/adt/union/union');


/*~
 * stability: stable
 * authors:
 *   - "@boris-marinov"
 *   - Quildreen Motta
 * 
 * name: module folktale/maybe
 */
module.exports = {
  Just: Maybe.Just,
  Nothing: Maybe.Nothing,
  hasInstance: Maybe.hasInstance,
  of: Maybe.of,
  empty: Maybe.empty,
  fromJSON: Maybe.fromJSON,
  [typeSymbol]: Maybe[typeSymbol],
  ['fantasy-land/of']: Maybe['fantasy-land/of'],

  /*~
   * stability: stable
   * type: |
   *   forall a: (a or void) => Maybe a
   */
  fromNullable(aNullable) {
    return require('folktale/conversions/nullable-to-maybe')(aNullable);
  },

  /*~
   * stability: stable
   * type: |
   *   forall a, b: (Result a b) => Maybe b
   */
  fromResult(aResult) {
    return require('folktale/conversions/result-to-maybe')(aResult);
  },

  /*~
   * stability: stable
   * type: |
   *   forall a, b: (Validation a b) => Maybe b
   */
  fromValidation(aValidation) {
    return require('folktale/conversions/validation-to-maybe')(aValidation);
  }
};
