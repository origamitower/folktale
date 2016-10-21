//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// See LICENCE for licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

const mm = Symbol.for('@@meta:magical');

const copyDocumentation = (source, target, extensions = {}) => {
  if (process.env.FOLKTALE_DOCS !== 'false') {
    target[mm] = Object.assign({}, source[mm] || {}, extensions);
  }
}

module.exports = copyDocumentation;
