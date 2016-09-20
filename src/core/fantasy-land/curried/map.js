//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// See LICENCE for licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

const { map } = require('fantasy-land')
const warn = require('folktale/helpers/warn-deprecated')('map')
const unsupported = require('folktale/helpers/unsupported-method')('map')

module.exports = (f) => (a) => 
  typeof a[map] === 'function' ? a[map](f)
: typeof a.map  === 'function' ? warn(a.map(f))
: /*otherwise*/                  unsupported(a);
