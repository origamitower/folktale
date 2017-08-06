//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

// This module basically includes common type aliases/functions that
// are used throughout the Folktale library

// Any special folktale object has this
type Folktale<A extends string> = {
  '@@folktale/type': A
};


// Simplified function types
type F1<A, B> = (_: A) => B
type F2<A, B, C> = (a: A, b: B) => C
type F3<A, B, C, D> = (a: A, b: B, c: C) => D
type F4<A, B, C, D, E> = (a: A, b: B, c: C, d: D) => E
type F5<A, B, C, D, E, F> = (a: A, b: B, c: C, d: D, e: E) => F
type F6<A, B, C, D, E, F, G> = (a: A, b: B, c: C, d: D, e: E, f: F) => G
type F7<A, B, C, D, E, F, G, H> = (a: A, b: B, c: C, d: D, e: E, f: F, g: G) => G
type F8<A, B, C, D, E, F, G, H, I> = (a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H) => I
type F9<A, B, C, D, E, F, G, H, I, J> = (a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H, i: I) => J


// Some simplified types for objects
type Dict<A> = { [key: string]: A }
