//---------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// See LICENCE for licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//---------------------------------------------------------------------

/*~
 * Transforms values of an object with an unary function.
 *
 * The transformation works on the values of each own, enumerable
 * property of the given object. Inherited and non-enumerable
 * properties are ignored by this function.
 * 
 * 
 * ## Example::
 *
 *     const pair = { x: 10, y: 20 };
 *     mapValues(pair, x => x * 2);
 *     // ==> { x: 20, y: 40 }
 *
 * 
 * ## Caveats
 * 
 * `mapValues` will not preserve the shape of the original object.
 * It treats objects as plain maps from String to some value, and
 * ignores things like prototypical delegation, symbols, and non-enumerable
 * properties.
 *
 * ---
 * category  : Transforming
 * stability : stable
 * authors:
 *   - Quildreen Motta
 *
 * complexity: O(n), n is the number of own enumerable properties.
 * type: |
 *   (Object 'a, ('a) => 'b) => Object 'b
 */
const mapValues = (object, transformation) => {
  const keys = Object.keys(object);
  const result = {};

  for (let i = 0; i < keys.length; ++i) {
    const key = keys[i];
    result[key] = transformation(object[key]);
  }

  return result;
};


// --[ Convenience ]---------------------------------------------------

/*~
 * Conveniently transforms values in an object using the This-Binding syntax.
 * 
 * This is a free-method version of `mapValues` that applies the `this`
 * argument first, then the function it takes as argument. It's meant to
 * be used with the [This-Binding Syntax][es-bind] proposal.
 * 
 *     const map = mapValues.infix;
 *     const pair = { x: 10, y: 20 };
 *     pair::map(x => x * 2);
 *     // ==> { x: 20, y: 40 }
 * 
 * [es-bind]: https://github.com/zenparsing/es-function-bind
 * 
 * ---
 * category  : Convenience
 * stability : experimental
 * authors:
 *   - Quildreen Motta
 * 
 * complexity: O(n), n is the number of own enumerable properties.
 * type: |
 *   (Object 'a) . (('a) => 'b) => Object 'b
 */
mapValues.infix = function(transformation) {
  return mapValues(this, transformation);
};


// --[ Exports ]-------------------------------------------------------
module.exports = mapValues;
