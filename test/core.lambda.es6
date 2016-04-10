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

const { property } = require('jsverify');
const _ = require('../').core.lambda;

describe('Core.Lambda', function() {
  describe('compose(f, g)', function() {
    property('= f(g(x))', 'integer', (a) => {
      const f = (x) => x - 1;
      const g = (y) => y * 2;
      return _.compose(f, g)(a) === f(g(a));
    });

    property('Associativity: compose(f, compose(g, h)) = compose(compose(f, g), h)', 'integer', (a) => {
      const f = (x) => x - 1;
      const g = (x) => x * 2;
      const h = (x) => x / 3;
      return _.compose(f, _.compose(g, h))(a) === _.compose(_.compose(f, g), h)(a);
    });
  });


});
