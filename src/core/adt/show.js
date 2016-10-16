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
 * Provides a textual representation for ADTs.
 * 
 * The `show` serialisation bestows ES2015's `Symbol.toStringTag`, used
 * for the native `Object.prototype.toString`, along with a `.toString()`
 * method and Node's REPL `.inspect()` method.
 * 
 * 
 * ## Example::
 * 
 *     const { data, show } = require('folktale/core/adt');
 *     const { Id } = data('Id', {
 *       Id(value){ return { value } }
 *     }).derive(show);
 * 
 *     Object.prototype.toString.call(Id(1));
 *     // => '[object Id.Id]'
 * 
 *     Id(1).toString();
 *     // ==> 'Id.Id({ value: 1 })'
 * 
 *     Id(1).inspect();
 *     // ==> 'Id.Id({ value: 1 })'
 * 
 * 
 * ## ES2015's ToStringTag
 * 
 * This derivation defines ES2015's `ToStringTag` symbol, which is used
 * by [Object.prototype.toString][toString] to construct a default textual
 * representation of the object.
 * 
 * This means that instead of getting `'[object Object]'`, you'll get
 * a more helpful `'[object <Type>.<Tag>]'` representation, where this
 * function is used.
 * 
 * [toString]: http://www.ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring
 * 
 * 
 * ## Textual representation
 * 
 * This derivation defines a `.toString()` method. `.toString` is called
 * in many places to define how to represent an object, but also called
 * when JS operators want to convert an object to a String. This derivation
 * only cares about representation that's suitable for debugging.
 * 
 * The representation includes the type, tag, and key/value pairs of the
 * data structure.
 * 
 * 
 * ## Node REPL representation
 * 
 * Node's REPL uses `.inspect()` instead of the regular `.toString()`.
 * This derivation also provides the `.inspect()` method, but just as
 * an alias for the `.toString()` method.
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
const show = (variant, adt) => {
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
