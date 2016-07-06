
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

const { Left, Right } = require('folktale/data/either/core');

module.exports = (aValidation) => 
  aValidation.cata({
    Failure: ({value}) => Left(value),
    Success: ({value}) => Right(value)
  });
