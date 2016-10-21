require('babel-polyfill');
require('es5-shim');
require('es6-shim');

process.env.FOLKTALE_ASSERTIONS = 'none';

require('../specs/core.adt');
require('../specs/core.fantasy-land');
require('../specs/core.lambda');
require('../specs/core.object');
require('../specs/data.either');
require('../specs/data.future');
require('../specs/data.maybe');
require('../specs/data.task');
require('../specs/data.validation');
require('../specs/documentation');