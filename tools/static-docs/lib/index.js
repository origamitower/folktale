'use strict';

//----------------------------------------------------------------------
//
// This source file is part of the Meta:Magical project.
//
// See LICENCE for licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

// --[ Dependencies ]---------------------------------------------------
var mkdirp = require('mkdirp').sync;
var fs = require('fs');
var path = require('path');

var formatters = require('./formatters');

var _require = require('./staticalise'),
    makeStatic = _require.makeStatic;

// --[ Helpers ]-------------------------------------------------------


var write = function write(file, data) {
  return fs.writeFileSync(file, data);
};

// --[ Implementation ]------------------------------------------------
var generate = function generate(files, options) {
  var outputDirectory = options.outputDirectory || '.';
  var verbose = options.verbose || false;

  files.forEach(function (file) {
    var filename = path.join(outputDirectory, file.filename);
    if (verbose) {
      console.log('- Writing ', filename);
    }
    mkdirp(path.dirname(filename));
    write(filename, file.content);
  });
};

// --[ Exports ]-------------------------------------------------------
module.exports = {
  generate: generate,
  makeStatic: makeStatic,
  formatters: formatters
};