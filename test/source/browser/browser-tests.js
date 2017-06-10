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

require('../specs/base/adt/union');
require('../specs/base/concurrency/future');
require('../specs/base/concurrency/task');
require('../specs/base/core/lambda');
require('../specs/base/core/object');
require('../specs/base/fantasy-land/fantasy-land');
require('../specs/base/maybe/maybe');
require('../specs/base/result/result');
require('../specs/base/validation/validation');