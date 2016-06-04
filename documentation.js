var Interface = require('metamagical-interface');
var Browser   = require('metamagical-repl')(Interface);
var Folktale  = require('./');

module.exports = Browser.for(Interface.for(Folktale));