const { tagSymbol, typeSymbol } = require('./core');

const objectToKeyValuePairs = (object) =>
  Object.keys(object).map((key) => `${key}: ${showValue(object[key])}`).join(', ');

const plainObjectToString = function() {
  return `{ ${objectToKeyValuePairs(this)} }`;
};

const arrayToString = function() {
  return `[${this.map(showValue).join(', ')}]`;
};

const functionNameToString = (fn) => fn.name !== '' ? `: ${fn.name}` : '';
const functionToString = (fn) => `[Function${functionNameToString(fn)}]`;

const nullToString = () => 'null';

const objectToString = (object) => {
  return object === null                        ? nullToString
  :      Array.isArray(object)                  ? arrayToString
  :      object.toString() === ({}).toString()  ? plainObjectToString
  :      /* otherwise */                          object.toString;
};

const showValue = (value) => {
  return typeof value === 'undefined' ? 'undefined'
  :      typeof value === 'function'  ? functionToString(value)
  :      typeof value === 'symbol'    ? value.toString()
  :      typeof value === 'object'    ? objectToString(value).call(value)
  :      /* otherwise */                JSON.stringify(value)
};

module.exports = (variant, adt) => {
  const typeName = adt[typeSymbol];
  const variantName = `${adt[typeSymbol]}.${variant.prototype[tagSymbol]}`;

  // (for Object.prototype.toString)
  adt[Symbol.toStringTag]               = typeName;
  variant.prototype[Symbol.toStringTag] = variantName;
  // (regular JavaScript representations)
  adt.toString               = () => typeName;
  variant.toString           = () => variantName;
  variant.prototype.toString = function() {
    return `${variantName}(${plainObjectToString.call(this)})`;
  };
  // (Node REPL representations)
  adt.inspect                = adt.toString;
  variant.inspect            = variant.toString;
  variant.prototype.inspect  = variant.prototype.toString;
  return variant;
};

