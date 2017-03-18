//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------


const Maybe = require('./maybe');
const { typeSymbol } = require('folktale/core/adt/data');


/*~
 * stability: unstable
 * authors:
 *   - "@boris-marinov"
 *   - Quildreen Motta
 * 
 * name: module folktale/data/maybe
 */
module.exports = {
  Just: Maybe.Just,
  Nothing: Maybe.Nothing,
  hasInstance: Maybe.hasInstance,
  of: Maybe.of,
  fromJSON: Maybe.fromJSON,
  [typeSymbol]: Maybe[typeSymbol],
  ['fantasy-land/of']: Maybe['fantasy-land/of'],

  /*~
   * stability: stable
   * type: |
   *   forall a: (a or void) => Maybe a
   */
  fromNullable(aNullable) {
    return require('folktale/data/conversions/nullable-to-maybe')(aNullable);
  },

  /*~
   * stability: stable
   * type: |
   *   forall a, b: (Result a b) => Maybe b
   */
  fromResult(aResult) {
    return require('folktale/data/conversions/result-to-maybe')(aResult);
  },

  /*~
   * stability: stable
   * type: |
   *   forall a, b: (Validation a b) => Maybe b
   */
  fromValidation(aValidation) {
    return require('folktale/data/conversions/validation-to-maybe')(aValidation);
  }
};
