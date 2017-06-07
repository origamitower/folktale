//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

function thunk(fn) {
  let value;
  let computed = false;

  return () => {
    if (computed) {
      return value;
    } else {
      computed = true;
      value = fn();
      return value;
    }
  };
}

module.exports = thunk;
