//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

// --[ Dependencies ]---------------------------------------------------
const extend = require('folktale/helpers/extend');

// --[ Constants and Aliases ]------------------------------------------
const TYPE = Symbol.for('@@folktale:adt:type');
const TAG = Symbol.for('@@folktale:adt:tag');
const ANY = Symbol.for('@@folktale:adt:default');
const META = Symbol.for('@@meta:magical');

// --[ Helpers ]--------------------------------------------------------
const keys = Object.keys;

//
// Transforms own enumerable key/value pairs.
//
function mapObject(object, transform, initial = {}) {
  return keys(object).reduce((result, key) => {
    Object.defineProperty(result, key, transform(key, object[key]));
    return result;
  }, initial);
}

const capitalCase = str => 
  str.replace(/(^|\s)[a-z]/g, l => l.toUpperCase()); 

// --[ Record implementation ] -----------------------------------------

const primitives = [Number, String, Boolean, Symbol, null, undefined];

//
// Get primitive type
// eslint-disable-next-line eqeqeq
const getPrimitiveType = type => {
  if (type === null) {
    return 'object';
  }
  if (type === undefined) {
    return 'undefined';
  }
  return type.name.toLowerCase();
};
//
// Check that value type equals transmitted type 
//
const isSameType = (type, value) =>
  primitives.includes(type) ? 
    typeof value === getPrimitiveType(type) 
    : value instanceof type;

//
// Get presentable name of value type
//
const getPresentableType = value => {
  const valuePrototype = Object.getPrototypeOf(value || {});
  switch (typeof value) {
  case 'undefined': 
    return 'Undefined';
  case 'object':
    if (value === null) {
      return 'Null';
    }
    if (!valuePrototype || !valuePrototype.constructor) {
      return 'Object';
    }
    return valuePrototype.constructor.name || 'Object';
  default:
    return capitalCase(typeof value);
  }
};

//
// Get TypeError message
//
const getTypeMissmatchErrorMessage = (field, type, value) => 
  `'${field}' type ${
        type ? type.name : capitalCase(String(type))
      } does not match with type ${getPresentableType(value)}`;
//
// Return readonly field or throw type error
//
const fieldGetter = initialValues => (field, type) => {
  const value = initialValues[field];
  if (!isSameType(type, value)) {
    throw new TypeError(getTypeMissmatchErrorMessage(field, type, value));
  }
  return {
    value: initialValues[field],
    enumerable: true
  };
};

/*~ ~belongsTo: record*/
const Record = {
   /*~
   * type: |
   *   (Object => Record) . (...(Object => Record) => Any) => (Object => Record)
   */
  derive(...derivations) {
    derivations.forEach(derivation => derivation(this.constructor, this));
    return this;
  }
};

/*~
 * stability: proposal
 * type: |
 *  (String, Object (Array String)) => (Object => Record)
 */
const record = (typeId, pattern) => {
  const Constructor = function(initialValues) {
    return mapObject(pattern, fieldGetter(initialValues), this);
  };
  const makeInstance = initialValues => new Constructor(initialValues); 
  extend(Constructor.prototype, {
    // This is internal, and we don't want the user to be messing with this.
    [TAG]: 'constructor',

    // This is internal, and we don't really document it to the user
    [TYPE]: typeId,

    /*~ ~inheritsMeta: constructor */
    get constructor() {
      return Constructor;
    }
  });
  extend(makeInstance, Record, { 
    // This field is needed for error messages
    name: typeId, 

    // This is internal, and we don't really document it to the user
    [TYPE]: typeId,

    // Needed for derivations
    get constructor() {
      return Constructor;
    },

    /*~ ~belongsTo: makeInstance */
    prototype: Constructor.prototype
  });
  return makeInstance;
};


// --[ Exports ]--------------------------------------------------------
record.Record     = Record;
record.typeSymbol = TYPE;
record.tagSymbol  = TAG;
record.any        = ANY;

module.exports = record;
