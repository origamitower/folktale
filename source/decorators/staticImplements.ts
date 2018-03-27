/*
----------------------------------------------------------------------

 This source file is part of the Folktale project.

 Licensed under MIT. See LICENCE for full licence information.
 See CONTRIBUTORS for the list of contributors to the project.

----------------------------------------------------------------------
*/

/* class decorator to enforce implementation of static methods */
export function staticImplements<T>() {
    return (constructor: T) => {};
}
