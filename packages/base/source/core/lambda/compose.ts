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

type F<A, B> = (_: A) => B

interface All {
  // arity 1
  <A, B>
  (a: F<A, B>): F<A, B>
  
  // arity 2
  <A, B, C>
  (a: F<B, C>, b: F<A, B>): F<A, C>
  
  // arity 3
  <A, B, C, D>
  (a: F<C, D>, b: F<B, C>, c: F<A, B>): F<A, D>
  
  // arity 4
  <A, B, C, D, E>
  (a: F<D, E>, b: F<C, D>, c: F<B, C>, d: F<A, B>): F<A, E>
  
  // arity 5
  <A, B, C, D, E, G>
  (a: F<E, G>, b: F<D, E>, c: F<C, D>, d: F<B, C>, e: F<A, B>): F<A, G>

  // arity 6
  <A, B, C, D, E, G, H>
  (a: F<G, H>, b: F<E, G>, c: F<D, E>, d: F<C, D>, e: F<B, C>, f: F<A, B>): F<A, H>

  // arity 7
  <A, B, C, D, E, G, H, I>
  (a: F<H, I>, b: F<G, H>, c: F<E, G>, d: F<D, E>, e: F<C, D>, f: F<B, C>, g: F<A, B>): F<A, I>

  // arity 8
  <A, B, C, D, E, G, H, I, J>
  (a: F<I, J>, b: F<H, I>, c: F<G, H>, d: F<E, G>, e: F<D, E>, f: F<C, D>, g: F<B, C>, h: F<A, B>): F<A, J>

  // arity 9
  <A, B, C, D, E, G, H, I, J, K>
  (a: F<J, K>, b: F<I, J>, c: F<H, I>, d: F<G, H>, e: F<E, G>, f: F<D, E>, g: F<C, D>, h: F<B, C>, i: F<A, B>): F<A, K>

  // any other arity
  (...fns: Function[]): Function
}