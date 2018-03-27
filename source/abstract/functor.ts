/*
----------------------------------------------------------------------

 This source file is part of the Folktale project.

 Licensed under MIT. See LICENCE for full licence information.
 See CONTRIBUTORS for the list of contributors to the project.

----------------------------------------------------------------------
*/

export abstract class Functor<A> {
    abstract map<B>(fn: (_: A) => B): Functor<B>;
}
