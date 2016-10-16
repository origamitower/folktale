//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// See LICENCE for licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

// --[ Dependencies ]---------------------------------------------------
const { tagSymbol, typeSymbol } = require('./data');
const mapValues = require('folktale/core/object/map-values');
const values = require('folktale/core/object/values');


// --[ Constants ]------------------------------------------------------
const typeJsonKey = '@@type';
const tagJsonKey = '@@tag';
const valueJsonKey = '@@value';


// --[ Helpers ]--------------------------------------------------------

/*~
 * Creates a type lookup table from an array of types.
 * 
 * ---
 * type: ((Object 'a) => 'b) => ([Object 'a]) => Object 'b  
 */
const arrayToObject = (extractKey) => (array) => 
  array.reduce((object, element) => {
    object[extractKey(element)] = element;
    return object;
  }, {});


/*~
 * Retrieves the property of an object.
 * 
 * ---
 * type: (String) => (Object 'a) => 'a | None 
 */
const property = (propertyName) => (object) => object[propertyName];


/*~
 * Specifies `arrayToObject`.
 * 
 * ---
 * type: ([Object 'a]) => Object 'a 
 */
const indexByType = arrayToObject(property(typeSymbol));


/*~
 * Tests a type identifier.
 * 
 * ---
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
 * Attempts to parse a value using a type dictionary.
 * 
 * ---
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
 * Converts a value to its JSON representation.
 * 
 * ---
 * type: ('a) => JSON
 */
const serializeValue = (value) =>
  value !== null && typeof value.toJSON === 'function' ? value.toJSON()
  : /* otherwise */                                      value;


// --[ Implementation ]-------------------------------------------------

/*~
 * Provides JSON serialisation and parsing for ADTs.
 * 
 * The `serialize` derivation bestows `.toJSON()` and `.fromJSON(value)`
 * upon ADTs constructed by Core.ADT. Both serialisation and parsing
 * are recursive, and `.fromJSON` can automatically reify values of
 * other types.
 * 
 * 
 * ## Example::
 * 
 *     const { data, setoid } = require('folktale/core/adt');
 *     const Id = data('Id', {
 *       Id(value){ return { value } }
 *     }).derive(serialize, setoid);
 * 
 *     Id.Id(1).toJSON();
 *     // ==> { '@@type': 'Id', '@@tag': 'Id', '@@value': { value: 1 } }
 * 
 *     Id.fromJSON(Id.Id(1).toJSON());
 *     // ==> Id.Id(1)
 * 
 * 
 * ## JSON serialisation
 * 
 * This derivation provides JSON serialisation through the `.toJSON` method,
 * which converts rich ADTs into objects that can be safely serialised as
 * JSON. For example::
 * 
 *     const data = require('folktale/core/adt/data');
 *     const { Id } = data('Id', {
 *       Id(value){ return { value } }
 *     }).derive(serialize);
 * 
 *     Id(1).toJSON();
 *     // ==> { '@@type': 'Id', '@@tag': 'Id', '@@value': { value: 1 } }
 * 
 * During the transformation, if any of the values contains a `.toJSON`
 * method, that's called to serialise the structure. Otherwise the value is
 * just returned as-is::
 * 
 *     Id(Id(1)).toJSON();
 *     // ==> { '@@type': 'Id', '@@tag': 'Id', '@@value': { value: { '@@type': 'Id', '@@tag': 'Id', '@@value': { 'value': 1 } } } }
 * 
 * It's not necessary to call the `.toJSON()` method directly in most cases, since
 * `JSON.stringify` will already invoke that for you::
 * 
 *     JSON.stringify(Id(1));
 *     // ==> '{"@@type":"Id","@@tag":"Id","@@value":{"value":1}}'
 * 
 *     JSON.stringify(Id([Id(1)]));
 *     // ==> '{"@@type":"Id","@@tag":"Id","@@value":{"value":[{"@@type":"Id","@@tag":"Id","@@value":{"value":1}}]}}'
 * 
 * 
 * ## JSON parsing
 * 
 * The reverse process of serialisation is parsing, and the `.fromJSON` method
 * provided by this derivation is able to reconstruct the proper ADT from
 * serialised data::
 * 
 *     const { data, setoid } = require('folktale/core/adt');
 *     const Id = data('Id', {
 *       Id(value){ return { value } }
 *     }).derive(serialize, setoid);
 * 
 *     const json = Id.Id(1).toJSON();
 *     Id.fromJSON(json);
 *     // ==> Id.Id(1)
 * 
 * In general, as long as the values in an ADT are either ADT instances or simple
 * values supported by JSON, the following equivalence holds:
 * 
 *     ADT.fromJSON(adt.toJSON()) = adt
 * 
 * Some ADTs instances may contain other ADT instances as values. Serialising them
 * is simple because JavaScript's dispatch takes care of selecting the correct
 * serialisation for us. With parsing we don't have that luck, so instead the
 * ADT takes a list of parsers as argument::
 * 
 *     const A = data('A', { 
 *       A(value) { return { value } }
 *     }).derive(serialize, setoid);
 * 
 *     const B = data('B', {
 *       B(value) { return { value } }
 *     }).derive(serialize, setoid);
 * 
 *     A.fromJSON(A.A(B.B(1)).toJSON(), [A, B]);
 *     // ==> A.A(B.B(1))
 * 
 * 
 * ## The serialisation format
 * 
 * In order to support the serialisatio and parsing of ADTs, this module
 * uses a specific format that encodes that information in the serialised
 * data. This way, `.toJSON()` produces values of this interface, and
 * `.fromJSON(value)` expects values of this interface:
 * 
 *     type JSONSerialisation = {
 *       "@@type":  String,
 *       "@@tag":   String,
 *       "@@value": Object Any
 *     }
 * 
 * 
 * ---
 * category: Derivation
 * stability: experimental
 * authors:
 *   - "@boris-marinov"
 * 
 * type: |
 *   (Variant, ADT) => Void 
 */
const serialize = (variant, adt) => {
  const typeName = adt[typeSymbol];
  const tagName = variant.prototype[tagSymbol];

  /*~
   * Serialises a variant to JSON.
   * 
   * ## Example::
   * 
   *     const { data, setoid } = require('folktale/core/adt');
   *     const Id = data('Id', {
   *       Id(value){ return { value } }
   *     }).derive(serialize, setoid);
   * 
   *     Id.Id(1).toJSON();
   *     // ==> { '@@type': 'Id', '@@tag': 'Id', '@@value': { value: 1 } }
   *
   * 
   * ---
   * category: Serialisation
   * stability: experimental
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
   * Parses a previously serialised ADT into a rich ADT object.
   * 
   * ## Example::
   * 
   *     const { data, setoid } = require('folktale/core/adt');
   *     const Id = data('Id', {
   *       Id(value){ return { value } }
   *     }).derive(serialize, setoid);
   * 
   *     Id.Id(1).toJSON();
   *     // ==> { '@@type': 'Id', '@@tag': 'Id', '@@value': { value: 1 } }
   * 
   *     Id.fromJSON(Id.Id(1).toJSON());
   *     // ==> Id.Id(1)
   * 
   * ---
   * category: Serialisation
   * stability: experimental
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
    return Object.assign(Object.create(adt[valueTagName].prototype), parsedValue);
  };
};


// --[ Exports ]--------------------------------------------------------
module.exports = serialize;
