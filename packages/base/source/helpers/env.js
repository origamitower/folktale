//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

module.exports = (name, defaultValue) => {
  try {
    return process.env[name];
  } catch (_) {
    return defaultValue;
  }
};