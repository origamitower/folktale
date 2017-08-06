//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

/**
 * The identity combinator. Always returns the argument it's given.
 * 
 *     import identity from 'folktale/core/lambda/identity'
 * 
 *     [1, 2, 3].map(identity);
 *     //: ==> [1, 2, 3]
 * 
 * @param value The value that will be returned
 * @stability stable
 */
export default
function identity<A>(value: A): A {
  return value;
}
