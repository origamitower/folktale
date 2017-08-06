//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

/**
 * Converts a regular JavaScript function to one that can be partially
 * applied by using special placeholders.
 * 
 *     import partialize, { hole as _ } from 'folktale/core/lambda/partialize'
 * 
 *     const sub = (x, y) => x - y;
 *     const psub = partialize(2, sub);
 * 
 *     [1, 2, 3].map(psub(_, 1));
 *     //: ==> [0, 1, 2]
 * 
 *     [1, 2, 3].map(psub(1, _));
 *     //: ==> [0, -1, -2]
 * 
 * @param arity -- The number of arguments the original function takes
 * @param fn    -- The function to wrap for partial application
 * @stability experimental
 */
const partialize: Partialize = (arity: number, fn: any) => (...args: any[]) => {
  if (args.length < arity) {
    throw new TypeError(`The partial function takes at ${arity} arguments, but was given ${args.length}.`);
  }

  // Figure out if we have holes
  let holes = 0;
  for (let i = 0; i < args.length; ++i) {
    if (args[i] === hole) {
      holes += 1;
    }
  }

  if (holes > 0) {
    // providing types here would require some better support for dependent typing
    // so instead we just cheat with `any`. That does mean that extra care has to
    // be taken to make sure we don't violate the types described, though :(
    return partialize(holes as any, (...newArgs: any[]) => {
      let realArgs = [];
      let argIndex = 0;

      for (let i = 0; i < args.length; ++i) {
        const arg = args[i];
        if (arg === hole) {
          realArgs.push(newArgs[argIndex]);
          argIndex += 1;
        } else {
          realArgs.push(arg);
        }
      }

      return fn(...realArgs);
    });
  } else {
    return fn(...args);
  }
};

export default partialize;


// TODO: Include partial interfaces up to arity 9
interface Partialize {
  <A, B>
  (arity: 1, fn: F1<A, B>): Partial1<A, B>

  <A, B, C>
  (arity: 2, fn: F2<A, B, C>): Partial2<A, B, C>

  <A, B, C, D>
  (arity: 3, fn: F3<A, B, C, D>): Partial3<A, B, C, D>

  <A, B, C, D, E>
  (arity: 4, fn: F4<A, B, C, D, E>): Partial4<A, B, C, D, E>

  (arity: number, fn: Function): any
}

interface Partial1<A, B> {
  (a: Hole): Partial1<A, B>
  (a: A): B
}

interface Partial2<A, B, C> {
  (a: Hole, b: Hole): Partial2<A, B, C>
  (a: Hole, b: B): Partial1<A, C>
  (a: A, b: Hole): Partial1<B, C>
  (a: A, b: B): C
}

interface Partial3<A, B, C, D> {
  (a: Hole, b: Hole, c: Hole): Partial3<A, B, C, D>
  
  (a: Hole, b: Hole, c: C): Partial2<A, B, D>
  (a: Hole, b: B, c: Hole): Partial2<A, C, D>
  (a: A, b: Hole, c: Hole): Partial2<B, C, D>

  (a: Hole, b: B, c: C): Partial1<A, D>
  (a: A, b: Hole, c: C): Partial1<B, D>
  (a: A, b: B, c: Hole): Partial1<C, D>

  (a: A, b: B, c: C): D
}

interface Partial4<A, B, C, D, E> {
  (a: Hole, b: Hole, c: Hole, d: Hole): Partial4<A, B, C, D, E>
  
  (a: Hole, b: Hole, c: Hole, d: D): Partial3<A, B, C, E>
  (a: Hole, b: Hole, c: C, d: Hole): Partial3<A, B, D, E>
  (a: Hole, b: B, c: Hole, d: Hole): Partial3<A, C, D, E>
  (a: A, b: Hole, c: Hole, d: Hole): Partial3<B, C, D, E>

  (a: Hole, b: Hole, c: C, d: D): Partial2<A, B, E>
  (a: Hole, b: B, c: Hole, d: D): Partial2<A, C, E>
  (a: Hole, b: B, c: C, d: Hole): Partial2<A, D, E>
  (a: A, b: Hole, c: Hole, d: D): Partial2<B, C, E>
  (a: A, b: Hole, c: C, d: Hole): Partial2<B, D, E>
  (a: A, b: B, c: Hole, d: Hole): Partial2<C, D, E>
  
  (a: Hole, b: B, c: C, d: D): Partial1<A, E>
  (a: A, b: Hole, c: C, d: D): Partial1<B, E>
  (a: A, b: B, c: Hole, d: D): Partial1<C, E>
  (a: A, b: B, c: C, d: Hole): Partial1<D, E>
}


/**
 * The Hole is a special value used to indicate you don't want to fill
 * a positional parameter just yet.
 * 
 * @stability experimental
 */
export const hole: Folktale<'folktale:hole'> = { 
  '@@folktale/type': 'folktale:hole' 
};

type Hole = typeof hole;
