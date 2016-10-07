//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// See LICENCE for licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

module.exports = (methodName) => (object) => {
  throw new TypeError(`${object} does not have a method '${methodName}'.`);
};
