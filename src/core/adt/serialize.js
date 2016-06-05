const { tagSymbol, typeSymbol } = require('./core');
const mapValues = require('folktale/core/object/map-values');

const assertType = (given, expected) => {
  if (expected !== given) {
    throw new TypeError(`
       The JSON structure was generated from ${expected}.
       You are trying to serialize it into ${given}. 
    `);
  }
};
const parseValue = (parsers) => (value) =>
  parsers[value.typeName] ? parsers[value.typeName].fromJSON(value, parsers)
  : /* else */              value;

const serializeValue = (value) =>
  typeof value.toJSON === 'function' ? value.toJSON() : value;

module.exports = (variant, adt) => {
  const typeName = adt[typeSymbol];
  const tagName = variant.prototype[tagSymbol];

  variant.prototype.toJSON = function() {
    return { typeName, tagName, value: mapValues(this, serializeValue) };
  };

  adt.fromJSON = function(value, parsers = { [typeName]: adt }) {
    assertType(typeName, value.typeName);
    const parsedValue = mapValues(value.value, parseValue(parsers));
    return Object.assign(Object.create(adt[value.tagName].prototype), parsedValue);
  };
};
