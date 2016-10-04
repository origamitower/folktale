//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// See LICENCE for licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

// const { bimap } = require('fantasy-land')
// const warn = require('folktale/helpers/warn-deprecated')('bimap')
// const unsupported = require('folktale/helpers/unsupported-method')('bimap')

module.exports = (f, g, a) => 
  typeof a.bimap  === 'function' ? a.bimap(f, g)
: /*otherwise*/                    unsupported(a);
