//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

// --[ Dependencies ]---------------------------------------------------
const { tagSymbol, typeSymbol } = require('./data');


// --[ Helpers ]--------------------------------------------------------
/*~
 * Returns a string representing `key: value` pairs separated by
 * commas.
 * ---
 * type: (Object Any) => String
 */
const objectToKeyValuePairs = (object) =>
  Object.keys(object)
        .map((key) => `${key}: ${showValue(object[key])}`)
        .join(', ');

/*~
 * Returns a presentation of a plain object.
 * ---
 * type: (Object Any).() => String
 */
const plainObjectToString = function() {
  return `{ ${objectToKeyValuePairs(this)} }`;
};

/*~
 * Returns a representation of an array.
 * ---
 * type: (Array Any).() => String
 */
const arrayToString = function() {
  return `[${this.map(showValue).join(', ')}]`;
};

/*~
 * Returns a representation of a function's name.
 * ---
 * type: (Function) => String
 */
const functionNameToString = (fn) => fn.name !== '' ? `: ${fn.name}` : '';

/*~
 * Returns a representation of a function.
 * ---
 * type: (Function) => String
 */
const functionToString = (fn) => `[Function${functionNameToString(fn)}]`;

/*~
 * Returns a representation of a null value.
 * ---
 * type: () => String
 */
const nullToString = () => 'null';

/*~
 * Returns a representation of any JS object.
 * ---
 * type: (Null | Object Any) => String
 */
const objectToString = (object) =>
    object === null                       ?  nullToString
  : Array.isArray(object)                 ?  arrayToString
  : object.toString() === ({}).toString() ?  plainObjectToString
  : /* otherwise */                          object.toString;


/*~
 * Returns a representation of any JS value.
 * ---
 * type: (Any) => String
 */
const showValue = (value) =>
    typeof value === 'undefined' ?  'undefined'
  : typeof value === 'function'  ?  functionToString(value)
  : typeof value === 'symbol'    ?  value.toString()
  : typeof value === 'object'    ?  objectToString(value).call(value)
  : /* otherwise */                 JSON.stringify(value);

// --[ Implementation ]------------------------------------------------

/*~
 * ---
 * category: Derivation
 * stability: experimental
 * authors:
 *   - "@boris-marinov"
 * 
 * type: |
 *   (Variant, ADT) => Void
 */
const show = (variant, adt) => {  // eslint-disable-line max-statements
  const typeName    = adt[typeSymbol];
  const variantName = `${adt[typeSymbol]}.${variant.prototype[tagSymbol]}`;

  // (for Object.prototype.toString)
  adt[Symbol.toStringTag]               = typeName;
  variant.prototype[Symbol.toStringTag] = variantName;

  // (regular JavaScript representations)
  /*~
   * Returns a textual representation of the ADT.
   * ---
   * category: Debug Representation
   * stability: experimental
   * authors:
   *   - "@boris-marinov"
   * 
   * type: |
   *   () => String
   */
  adt.toString = () => typeName;

  /*~
   * Returns a textual representation of the Variant.
   * ---
   * category: Debug Representation
   * stability: experimental
   * authors:
   *   - "@boris-marinov"
   * 
   * type: |
   *   () => String
   */
  variant.toString = () => variantName;

  /*~
   * Returns a textual representation of the ADT instance.
   * ---
   * category: Debug Representation
   * stability: experimental
   * authors:
   *   - "@boris-marinov"
   * 
   * type: |
   *   (ADT).() => String
   */
  variant.prototype.toString = function() {
    return `${variantName}(${plainObjectToString.call(this)})`;
  };

  // (Node REPL representations)
  adt.inspect                = adt.toString;
  variant.inspect            = variant.toString;
  variant.prototype.inspect  = variant.prototype.toString;

  return variant;
};

// --[ Exports ]-------------------------------------------------------
module.exports = show;
