//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------


/**
 * Composes two unary functions.
 * 
 *     import compose from 'folktale/core/lambda/compose';
 *     
 *     const upcase = (x) => x.toUpperCase();
 *     const at = (prop) => (obj) => obj[prop];
 * 
 *     [{ name: 'Alice' }, { name: 'Max' }, { name: 'Talib' }].map(
 *       compose(upcase, at('name'))
 *     );
 *     //: ==> ['ALICE', 'MAX', 'TALIB']
 * 
 * 
 * @param f The second function to be applied
 * @param g The first function to be applied
 * @stability stable
 */
export default
function compose<A, B, C>(f: (_: B) => C, g: (_: A) => B): (_: A) => C {
  return (value: A) => f(g(value));
}


/**
 * A convenience function for using [[compose]] as a method.
 * 
 * @param that The second function to be applied
 * @param this The first function to be applied
 * @stability stable
 */
export
function infix<A, B, C>(this: (_: A) => B, that: (_: B) => C): (_: A) => C {
  return compose(that, this);
}


/**
 * A convenience function for composing more than two functions.
 * 
 * > **NOTE**
 * > it's not possible to provide a useful generic type for this function,
 * > types are provided for common arities.
 * 
 * @param fns... The functions to be applied, right-to-left
 * @stability stable
 */
export
const all: All = function all(...fns: any[]): any {
  if (fns.length < 1) {
    throw new TypeError(`compose.all requires at least one argument, ${fns.length} given.`);
  } else {
    return fns.reduce(compose);
  }
}

interface All {
  // arity 1
  <A, B>
  (a: F1<A, B>): F1<A, B>
  
  // arity 2
  <A, B, C>
  (a: F1<B, C>, b: F1<A, B>): F1<A, C>
  
  // arity 3
  <A, B, C, D>
  (a: F1<C, D>, b: F1<B, C>, c: F1<A, B>): F1<A, D>
  
  // arity 4
  <A, B, C, D, E>
  (a: F1<D, E>, b: F1<C, D>, c: F1<B, C>, d: F1<A, B>): F1<A, E>
  
  // arity 5
  <A, B, C, D, E, G>
  (a: F1<E, G>, b: F1<D, E>, c: F1<C, D>, d: F1<B, C>, e: F1<A, B>): F1<A, G>

  // arity 6
  <A, B, C, D, E, G, H>
  (a: F1<G, H>, b: F1<E, G>, c: F1<D, E>, d: F1<C, D>, e: F1<B, C>, f: F1<A, B>): F1<A, H>

  // arity 7
  <A, B, C, D, E, G, H, I>
  (a: F1<H, I>, b: F1<G, H>, c: F1<E, G>, d: F1<D, E>, e: F1<C, D>, f: F1<B, C>, g: F1<A, B>): F1<A, I>

  // arity 8
  <A, B, C, D, E, G, H, I, J>
  (a: F1<I, J>, b: F1<H, I>, c: F1<G, H>, d: F1<E, G>, e: F1<D, E>, f: F1<C, D>, g: F1<B, C>, h: F1<A, B>): F1<A, J>

  // arity 9
  <A, B, C, D, E, G, H, I, J, K>
  (a: F1<J, K>, b: F1<I, J>, c: F1<H, I>, d: F1<G, H>, e: F1<E, G>, f: F1<D, E>, g: F1<C, D>, h: F1<B, C>, i: F1<A, B>): F1<A, K>

  // any other arity
  (...fns: Function[]): Function
}