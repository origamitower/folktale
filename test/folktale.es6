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

defineTests(require('../'));
