//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

const hasOwnProperty = Object.prototype.hasOwnProperty;


/**
 * Transforms `[key, value]` pairs from an object into new pairs.
 * 
 *     import mapEntries from 'folktale/core/object/map-entries';
 * 
 *     const fruits = {
 *       'apple': 'maçã',
 *       'banana': 'banana'
 *     };
 * 
 *     mapEntries(
 *       fruits, 
 *       ([k, v]) => [k.toUpperCase(), v.toUpperCase()],
 *       (o, k, v) => Object.assign(o, { [k]: v })
 *     );
 *     //: => { 'APPLE': 'MAÇÃ', 'BANANA': 'BANANA' }
 * 
 * @param object -- The original object
 * @param transform -- A transformation for the (key, value) pairs in the original object
 * @param define -- A way of storing the new (key, value) pairs in the resulting object
 * 
 * @see overwrite -- Convenience that overwrites duplicate keys
 * @see unique -- Convenience that throws on duplicate keys
 * 
 * @complexity O(n) -- n is the number of own enumerable properties in `object`
 * @stability stable
 */
export default
function mapEntries<A, B>(
  object: Dict<A>,
  transform: (pair: [string, A]) => [string, B],
  define: (target: Dict<B>, key: string, value: B) => Dict<B>
): Dict<B> {
  const keys = Object.keys(object);
  let result: Dict<B> = {};

  for (let i = 0; i < keys.length; ++i) {
    const key = keys[i];
    const value = object[key];
    const [newKey, newValue] = transform([key, value]);
    result = define(result, newKey, newValue);
  }

  return result;
}


/**
 * Convenience for mapping entries in an object where duplicate keys overwrite
 * existing keys.
 * 
 * > **NOTE**
 * > This function is non-deterministic in ES5 and earlier versions, because
 * > the order of iterating over an object is not determined.
 * 
 * @param object -- The original object
 * @param transform -- A transformation for the (key, value) pairs in the original object
 * 
 * @complexity O(n) -- n is the number of own enumerable properties in `object`
 * @stability stable
 */
export
function overwrite<A, B>(object: Dict<A>, transform: (pair: [string, A]) => [string, B]): Dict<B> {
  return mapEntries(object, transform, (result, key, value) => {
    result[key] = value;
    return result;
  });
}


/**
 * Convenience for mapping entries in an object where duplicate keys are an error.
 * 
 * @param object -- The original object
 * @param transform -- A transformation for the (key, value) pairs in the original object
 * @throws Error -- when the transform returns duplicate property names.
 * 
 * @complexity O(n) -- n is the number of own enumerable properties in `object`
 * @stability stable
 */
export function unique<A, B>(object: Dict<A>, transform: (pair: [string, A]) => [string, B]): Dict<B> {
  return mapEntries(object, transform, (result, key, value) => {
    if (hasOwnProperty.call(object, key)) {
      throw new Error(`The property ${key} already exists in the resulting object.`);
    }
    result[key] = value;
    return result;
  });
}
