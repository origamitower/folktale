//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

// --[ Dependencies ]---------------------------------------------------
const { tagSymbol, typeSymbol } = require('../union');
const mapValues = require('folktale/core/object/map-values');
const values = require('folktale/core/object/values');
const extend = require('folktale/helpers/extend');


// --[ Constants ]------------------------------------------------------
const typeJsonKey = '@@type';
const tagJsonKey = '@@tag';
const valueJsonKey = '@@value';


// --[ Helpers ]--------------------------------------------------------

/*~
 * type: ((Object 'a) => 'b) => ([Object 'a]) => Object 'b  
 */
const arrayToObject = (extractKey) => (array) => 
  array.reduce((object, element) => {
    object[extractKey(element)] = element;
    return object;
  }, {});


/*~
 * type: (String) => (Object 'a) => 'a | None 
 */
const property = (propertyName) => (object) => object[propertyName];


/*~
 * type: ([Object 'a]) => Object 'a 
 */
const indexByType = arrayToObject(property(typeSymbol));


/*~
 * type: (String, String) => Bool
 */
const assertType = (given, expected) => {
  if (expected !== given) {
    throw new TypeError(`
       The JSON structure was generated from ${expected}.
       You are trying to parse it as ${given}. 
    `);
  }
};


/*~
 * type: |
 *   type JSONSerialisation = {
 *     "@@type":  String,
 *     "@@tag":   String,
 *     "@@value": Object Any
 *   }
 *   type JSONParser = {
 *     fromJSON: (JSONSerialisation, Array JSONParser) => Variant
 *   }
 * 
 *   (Object JSONParser) => (JSONSerialisation) => Any
 */
const parseValue = (parsers) => (value) => {
  if (value !== null && typeof value[typeJsonKey] === 'string') {
    const type = value[typeJsonKey];
    if (parsers[type]) {
      return parsers[type].fromJSON(value, parsers, true);
    } else {
      return value;
    }
  } else {
    return value;
  }
};


/*~
 * type: ('a) => JSON
 */
const serializeValue = (value) =>
  value === undefined                                  ?  null
: value !== null && typeof value.toJSON === 'function' ?  value.toJSON()
: /* otherwise */                                         value;


// --[ Implementation ]-------------------------------------------------

/*~
 * stability: experimental
 * authors:
 *   - "@boris-marinov"
 * 
 * type: |
 *   (Variant, ADT) => Void 
 */
const serialization = (variant, adt) => {
  const typeName = adt[typeSymbol];
  const tagName = variant.prototype[tagSymbol];

  /*~
   * stability: experimental
   * module: null
   * authors:
   *   - "@boris-marinov"
   * 
   * type: |
   *   type JSONSerialisation = {
   *     "@@type":  String,
   *     "@@tag":   String,
   *     "@@value": Object Any
   *   }
   * 
   *   Variant . () => JSONSerialisation
   */
  variant.prototype.toJSON = function() {
    return { 
      [typeJsonKey]:  typeName, 
      [tagJsonKey]:   tagName, 
      [valueJsonKey]: mapValues(this, serializeValue) 
    };
  };

  /*~
   * stability: experimental
   * module: null
   * authors:
   *   - "@boris-marinov"
   * 
   * type: |
   *   type JSONSerialisation = {
   *     "@@type":  String,
   *     "@@tag":   String,
   *     "@@value": Object Any
   *   }
   *   type JSONParser = {
   *     fromJSON: (JSONSerialisation, Array JSONParser) => Variant
   *   }
   * 
   *   (JSONSerialisation, Array JSONParser) => Variant
   */
  adt.fromJSON = function(value, parsers = { [typeName]: adt }, keysIndicateType = false) {
    const valueTypeName = value[typeJsonKey];
    const valueTagName = value[tagJsonKey];
    const valueContents = value[valueJsonKey];
    assertType(typeName, valueTypeName);
    const parsersByType = keysIndicateType ? parsers
          : /*otherwise*/                    indexByType(values(parsers));

    const parsedValue = mapValues(valueContents, parseValue(parsersByType));
    return extend(Object.create(adt[valueTagName].prototype), parsedValue);
  };
};


// --[ Exports ]--------------------------------------------------------
module.exports = serialization;
