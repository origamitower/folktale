//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

/**
 * The constant combinator. Always returns the first argument given.
 * 
 *     import constant from 'folktale/core/lambda/constant'
 * 
 *     const counter = {
 *       current: 0,
 *       next(){ return ++this.current }
 *     };
 * 
 *     [0, 0, 0].map(constant(counter.next()));
 *     //: ==> [1, 1, 1]
 * 
 * @param value The value that will be returned
 * @stability: stable
 */
export default
function constant<A, B>(value: A): (_: B) => A {
  return (_) => value;
}
