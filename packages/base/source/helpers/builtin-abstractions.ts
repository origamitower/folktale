//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

const defineProperty = Object.defineProperty;


/**
 * `defineProperty` with better defaults.
 * 
 * @stability internal
 */
export function define<A extends Object>(object: A, name: string, value: any): A {
  return defineProperty(object, name, {
    value,
    writable: true,
    enumerable: true,
    configurable: true
  });
}
