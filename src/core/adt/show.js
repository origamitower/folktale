const { tagSymbol, typeSymbol } = require('./core');

const objectToKeyValuePairs = (object) =>
  Object.keys(object).map((key) => `${key}: ${showValue(object[key])}`).join(', ');

const plainObjectToString = function() {
  return `{ ${objectToKeyValuePairs(this)} }`;
};

const arrayToString = function() {
  return `[${this.map(showValue).join(', ')}]`;
};

const nullToString = () => 'null';

const objectToString = (object) => {
  return object === null                                ?  nullToString
  :      object.toString === Array.prototype.toString   ?  arrayToString
  :      object.toString === Object.prototype.toString  ?  plainObjectToString
  :      /* otherwise */                                   object.toString;
};

const showValue = (value) =>
  typeof value !== 'object' ? JSON.stringify(value) : objectToString(value).call(value);

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
