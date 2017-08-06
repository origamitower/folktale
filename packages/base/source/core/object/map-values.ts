//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

/**
 * Transforms the values of an object with an unary function.
 * 
 *     import mapValues from 'folktale/core/object/map-values'
 * 
 *     const fruits = {
 *       'apple': 'maçã',
 *       'banana': 'banana'
 *     };
 * 
 *     mapValues(fruits, x => x.toUpperCase());
 *     //: => { apple: 'MAÇÃ', banana: 'BANANA' }
 * 
 * @param object -- The object with values to transform
 * @param transformation -- A way of mapping values in the object
 * 
 * @complexity O(n) -- n is the number of own enumerable properties in `object`
 * @stability stable
 */
export default
function mapValues<A, B>(object: Dict<A>, transformation: (value: A) => B): Dict<B> {
  const keys = Object.keys(object);
  const result: Dict<B> = {};

  for (let i = 0; i < keys.length; ++i) {
    const key = keys[i];
    result[key] = transformation(object[key]);
  }

  return result;
}


/**
 * Conveniene for using [[mapValues]] as a method.
 * 
 * @param object -- The object with values to transform
 * @param transformation -- A way of mapping values in the object
 *
 * @complexity O(n) -- n is the number of own enumerable properties in `object`
 * @stability stable
 */
export
function infix<A, B>(this: Dict<A>, transformation: (value: A) => B): Dict<B> {
  return mapValues(this, transformation);
}
