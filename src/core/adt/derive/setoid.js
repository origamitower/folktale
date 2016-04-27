const assertType = require('../../../helpers/assertType')
const fl = require('fantasy-land');

const compareObjects = (one, two, keys) =>
  keys.reduce((eq, key)=> {
    if(one[key] === two[key]) {
      return eq
    } else if (one[fl.equals] === 'function' && two[fl.equals] === 'function' && one.equals(two)) {
      return eq
    } else {
      return false
    }
  }, true)

module.exports = (variant, adt) => {
  variant.prototype[fl.equals] = function(value) {
    assertType(variant.prototype, adt.name)(`${adt.name}.{variant.name}#equals`, value)
    return value[`is${variant.name}`] === true && compareObjects(this, value, Object.keys(this))
  };
  return variant
};
