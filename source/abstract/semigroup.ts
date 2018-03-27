/*
----------------------------------------------------------------------

 This source file is part of the Folktale project.

 Licensed under MIT. See LICENCE for full licence information.
 See CONTRIBUTORS for the list of contributors to the project.

----------------------------------------------------------------------
*/

export type Semigroup<A> = A & {
    concat(this: Semigroup<A>, that: Semigroup<A>): Semigroup<A>
};
