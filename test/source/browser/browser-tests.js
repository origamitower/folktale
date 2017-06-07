//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

require('babel-polyfill');
require('es5-shim');
require('es6-shim');

process.env.FOLKTALE_ASSERTIONS = 'none';

require('../specs/base/core.adt');
require('../specs/base/core.fantasy-land');
require('../specs/base/core.lambda');
require('../specs/base/core.object');
require('../specs/base/data.result');
require('../specs/base/data.future');
require('../specs/base/data.maybe');
require('../specs/base/data.task');
require('../specs/base/data.validation');