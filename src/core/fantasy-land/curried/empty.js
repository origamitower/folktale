//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// See LICENCE for licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

module.exports = (a) =>
  typeof a.empty === 'function' ? a.empty()
  : /*otherwise*/                 a.constructor.empty();
