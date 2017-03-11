//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

var Interface = require('metamagical-interface');
var Browser   = require('metamagical-repl')(Interface);
var Folktale  = require('./annotated');

module.exports = Browser.for(Interface.for(Folktale));