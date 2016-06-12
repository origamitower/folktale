const { tagSymbol, typeSymbol } = require('./core');
const mapValues = require('folktale/core/object/map-values');

const typeJsonKey = '@@type';
const tagJsonKey = '@@tag';
const valueJsonKey = '@@value';


const assertType = (given, expected) => {
  if (expected !== given) {
    throw new TypeError(`
       The JSON structure was generated from ${expected}.
       You are trying to parse it as ${given}. 
    `);
  }
};
const parseValue = (parsers) => (value) => {
  if (value !== null && typeof value[typeJsonKey] === 'string') {
    const type = value[typeJsonKey];
    if (parsers[type]) {
      return parsers[type].fromJSON(value, parsers);
    } else {
      return value;
    }
  } else {
    return value;
  }
};

const serializeValue = (value) =>
  value !== null && typeof value.toJSON === 'function' ? value.toJSON()
  : /* else */                                           value;

module.exports = (variant, adt) => {
  const typeName = adt[typeSymbol];
  const tagName = variant.prototype[tagSymbol];

  variant.prototype.toJSON = function() {
    return { [typeJsonKey]: typeName, [tagJsonKey]: tagName, [valueJsonKey]: mapValues(this, serializeValue) };
  };

  adt.fromJSON = function(value, parsers = { [typeName]: adt }) {
    const valueTypeName = value[typeJsonKey];
    const valueTagName = value[tagJsonKey];
    const valueContents = value[valueJsonKey];

    assertType(typeName, valueTypeName);
    const parsedValue = mapValues(valueContents, parseValue(parsers));
    return Object.assign(Object.create(adt[valueTagName].prototype), parsedValue);
  };
};
