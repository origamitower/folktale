//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

// --[ Dependencies ]---------------------------------------------------
const unionDebugRepresentation = require('folktale/adt/union/derivations/debug-representation');
const { tagSymbol, typeSymbol } = require('folktale/adt/record/record');

const debugRepresentation = (constructor, adt) => {
  const typeName  = adt[typeSymbol];
  const updatedConstructor = unionDebugRepresentation(constructor, adt);
  updatedConstructor.prototype[Symbol.toStringTag] = typeName;
  /*~
   * stability: proposal
   * mmodule: null
   * type: |
   *   () => String
   */
  updatedConstructor.toString = () => typeName;

  return updatedConstructor;
}; 


// --[ Exports ]-------------------------------------------------------
module.exports = debugRepresentation;
