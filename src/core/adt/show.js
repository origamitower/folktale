const { tagSymbol, typeSymbol } = require('./core');

const displayValues = (object) => Object.getOwnPropertyNames(object)
    .map((key) => object[key])
    .join(', ');

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
    return `${variantName}(${displayValues(this)})`;
  };
  // (Node REPL representations)
  adt.inspect                = adt.toString;
  variant.inspect            = variant.toString;
  variant.prototype.inspect  = variant.prototype.toString;
  return variant;
};
