//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

module.exports = (method, maybeObject) => {
  if (typeof maybeObject !== 'object') {
    throw new TypeError(`${method} expects an Object, but was given ${maybeObject}.`);
  }
};
