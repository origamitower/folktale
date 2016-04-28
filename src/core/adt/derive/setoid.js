const assertType = require('../../../helpers/assertType');
const fl = require('fantasy-land');

const equal = (a, b) =>
  typeof a[fl.equals] === 'function' && typeof b[fl.equals] === 'function' && a[fl.equals](b);

const compareObjects = (a, b, keys) => {
  for (let i = 0, len = keys.length; i < len; i++) {
    const keyA = a[keys[i]];
    const keyB = b[keys[i]];
    if (!((keyA === keyB) || equal(keyA, keyB))) {
      return false;
    }
  }
  return true;
};

module.exports = (variant, adt) => {
  variant.prototype[fl.equals] = function(value) {
    assertType(adt)(`${variant.name}#equals`, value);
    return value[`is${variant.name}`] === true && compareObjects(this, value, Object.keys(this));
  };
  return variant;
};
