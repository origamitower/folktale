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

const { property, forall} = require('jsverify');
const _ = require('../../').data.maybe;

describe('Data.Maybe', function() {

  describe('Conversions', function () {
    property('Just#fromEither', 'json', function(a) {
      return _.fromEither(_.Just(a).toEither()).equals(_.Just(a));
    });
    property('Nothing#fromEither', 'json', function(a) {
      return _.fromEither(_.Nothing().toEither()).equals(_.Nothing());
    });
  })
});
