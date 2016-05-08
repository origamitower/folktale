const assertType = require('folktale/helpers/assertType');
const fl = require('fantasy-land');
const { tagSymbol, typeSymbol } = require('./core');

const isSetoid = (value) => value != null &&  typeof value[fl.equals] === 'function';

const sameType = (a, b) => a[typeSymbol] === b[typeSymbol] && a[tagSymbol] === b[tagSymbol];


const createDerivation = (valuesEqual) => {
  const equals = (a, b) =>
    isSetoid(a) && isSetoid(b) ? a.equals(b)
    : /*otherwise */             valuesEqual(a, b);
  const compositesEqual = (a, b, keys) => {
    for (let i = 0, len = keys.length; i < len; i++) {
      const keyA = a[keys[i]];
      const keyB = b[keys[i]];
      if (!(equals(keyA, keyB))) {
        return false;
      }
    }
    return true;
  };
  const derivation = (variant, adt) => {
    variant.prototype[fl.equals] = function(value) {
      assertType(adt)(`${this[tagSymbol]}#equals`, value);
      return sameType(this, value) && compositesEqual(this, value, Object.keys(this));
    };
    return variant;
  };
  derivation.withEquality = createDerivation;
  return derivation;
};

module.exports = createDerivation((a, b) => a === b);
