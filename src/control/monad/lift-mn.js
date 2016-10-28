//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Copyright (C) 2015-2016 Quildreen Motta.
// Licensed under the MIT licence.
//
// See LICENCE for licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

const sequence = require('./sequence');

const noArgsError = () => {
  throw new Error('Please supply at least one argument.');
};

module.exports = (f) => (...argsM) => 
  argsM.length === 0 ? noArgsError()
 : /* otherwise */     sequence(argsM[0], argsM)
                         .map((args) => f(...args));
