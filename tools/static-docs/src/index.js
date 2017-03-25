//----------------------------------------------------------------------
//
// This source file is part of the Meta:Magical project.
//
// See LICENCE for licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

// --[ Dependencies ]---------------------------------------------------
const mkdirp         = require('mkdirp').sync;
const fs             = require('fs');
const path           = require('path');

const formatters     = require('./formatters');
const { makeStatic } = require('./staticalise');


// --[ Helpers ]-------------------------------------------------------
const write = (file, data) => fs.writeFileSync(file, data);


// --[ Implementation ]------------------------------------------------
const generate = (files, options) => {
  const outputDirectory = options.outputDirectory || '.';
  const verbose         = options.verbose || false;

  files.forEach(file => {
    const filename = path.join(outputDirectory, file.filename);
    if (verbose) {
      console.log('- Writing ', filename);      
    }
    mkdirp(path.dirname(filename));
    write(filename, file.content);
  });
};


// --[ Exports ]-------------------------------------------------------
module.exports = {
  generate,
  makeStatic,
  formatters
};
