//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

import { define } from '../../helpers/builtin-abstractions';


/**
 * Converts a list of pairs into an object. 
 * 
 *     import fromPairs from 'folktale/core/object/from-pairs'
 * 
 *     fromPairs([['name', 'Alissa'], ['age', 29]]);
 *     //: ==> { name: 'Alissa', age: 29 }
 * 
 * > **NOTE**
 * > Duplicated keys that appear later in the list will overwrite earlier ones.
 * 
 * @param pairs -- A list of [key, value] pairs that make up the object
 * @stability stable
 * @complexity O(n) -- `n` is the length of the array
 */
export default
function fromPairs(pairs: Array<[string, any]>): { [key: string]: any } {
  return pairs.reduce(
    (result, [key, value]) => define(result, key, value),
    {}
  );
}
