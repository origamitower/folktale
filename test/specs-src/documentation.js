//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// See LICENCE for licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

// This module runs all example-based tests defined in the documentation
const metamagical = require('metamagical-interface');
const defineTests = require('metamagical-mocha-bridge')(metamagical, describe, it);
const glob = require('glob').sync;
const path = require('path');


const makeTests = (langDir, lang) => {
  describe(`${lang} documentation examples`, () => {
    require.cache = {};
    const folktale = require('folktale');
    glob(path.join(__dirname, '../../docs/build/', langDir, '**/*.js')).forEach(f => require(f)(metamagical, folktale));

    defineTests(folktale);
  });
};


makeTests('en', 'English');
