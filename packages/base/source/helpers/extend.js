//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

const keys           = Object.keys;
const symbols        = Object.getOwnPropertySymbols;
const defineProperty = Object.defineProperty;
const property       = Object.getOwnPropertyDescriptor;


/*
 * Extends an objects with own enumerable key/value pairs from other sources.
 *
 * This is used to define objects for the ADTs througout this file, and there
 * are some important differences from Object.assign:
 *
 *   - This code is only concerned with own enumerable property *names*.
 *   - Additionally this code copies all own symbols (important for tags).
 *
 * When copying, this function copies **whole property descriptors**, which
 * means getters/setters are not executed during the copying. The only
 * exception is when the property name is `prototype`, which is not
 * configurable in functions by default.
 *
 * This code only special cases `prototype` because any other non-configurable
 * property is considered an error, and should crash the program so it can be
 * fixed.
 */
function extend(target, ...sources) {
  sources.forEach(source => {
    keys(source).forEach(key => {
      if (key === 'prototype') {
        target[key] = source[key];
      } else {
        defineProperty(target, key, property(source, key));
      }
    });
    symbols(source).forEach(symbol => {
      defineProperty(target, symbol, property(source, symbol));
    });
  });
  return target;
}


module.exports = extend;
