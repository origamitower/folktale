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


// --[ Helpers ]--------------------------------------------------------
/*~
 * type: (Object Any) => String
 */
const objectToKeyValuePairs = (object) =>
  Object.keys(object)
        .map((key) => `${key}: ${showValue(object[key])}`)
        .join(', ');

/*~
 * type: (Object Any).() => String
 */
const plainObjectToString = function() {
  return `{ ${objectToKeyValuePairs(this)} }`;
};

/*~
 * type: (Array Any).() => String
 */
const arrayToString = function() {
  return `[${this.map(showValue).join(', ')}]`;
};

/*~
 * type: (Function) => String
 */
const functionNameToString = (fn) => fn.name !== '' ? `: ${fn.name}` : '';

/*~
 * type: (Function) => String
 */
const functionToString = (fn) => `[Function${functionNameToString(fn)}]`;

/*~
 * type: () => String
 */
const nullToString = () => 'null';

/*~
 * type: (Null | Object Any) => String
 */
const objectToString = (object) =>
    object === null                       ?  nullToString
  : Array.isArray(object)                 ?  arrayToString
  : object.toString() === ({}).toString() ?  plainObjectToString
  : /* otherwise */                          object.toString;


/*~
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
 * stability: experimental
 * authors:
 *   - "@boris-marinov"
 * 
 * type: |
 *   (Variant, Union) => Void
 */
const debugRepresentation = (variant, adt) => {  // eslint-disable-line max-statements
  const typeName    = adt[typeSymbol];
  const variantName = `${adt[typeSymbol]}.${variant.prototype[tagSymbol]}`;

  // (for Object.prototype.toString)
  adt[Symbol.toStringTag]               = typeName;
  variant.prototype[Symbol.toStringTag] = variantName;

  // (regular JavaScript representations)
  /*~
   * stability: experimental
   * module: null
   * authors:
   *   - "@boris-marinov"
   * 
   * type: |
   *   () => String
   */
  adt.toString = () => typeName;

  /*~
   * stability: experimental
   * mmodule: null
   * authors:
   *   - "@boris-marinov"
   * 
   * type: |
   *   () => String
   */
  variant.toString = () => variantName;

  /*~
   * stability: experimental
   * module: null
   * authors:
   *   - "@boris-marinov"
   * 
   * type: |
   *   (Union).() => String
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
module.exports = debugRepresentation;
