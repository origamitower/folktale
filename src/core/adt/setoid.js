const assertType = require('folktale/helpers/assertType');
const fl = require('fantasy-land');

const isSetoid = (value) => value != null &&  typeof value[fl.equals] === 'function';

module.exports = (compareValues = ((a, b) => a === b)) => {
  const equals = (a, b) =>
    isSetoid(a) && isSetoid(b) ? a.equals(b)
    : /*otherwise */             compareValues(a, b);
  const compareObjects = (a, b, keys) => {
    for (let i = 0, len = keys.length; i < len; i++) {
      const keyA = a[keys[i]];
      const keyB = b[keys[i]];
      if (!(equals(keyA, keyB))) {
        return false;
      }
    }
    return true;
  };
  return (variant, adt) => {
    variant.prototype[fl.equals] = function(value) {
      assertType(adt)(`${variant.name}#equals`, value);
      return value[`is${variant.name}`] === true && compareObjects(this, value, Object.keys(this));
    };
    return variant;
  };
};
