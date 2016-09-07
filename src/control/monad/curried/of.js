//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// See LICENCE for licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

module.exports = (f) => (a) =>
  typeof f.of === 'function' ? f.of(a)
  : /*otherwise*/              f.constructor.of(a);
