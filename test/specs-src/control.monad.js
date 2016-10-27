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
const assert = require('assert');
const env = require('./environment');
const _ = require('../../control/monad');

describe('control.monad', () => {

  property('compose', 'json -> monad json', 'json -> monad json', 'json', env, (f, g, a) => 
    _.compose(f, g)(a).equals(f(a).chain(g))
  )
  property('rightCompose', 'json -> monad json', 'json -> monad json', 'json', env, (f, g, a) => 
    _.compose(f, g)(a).equals(g(a).chain(f))
  )
  property('sequence', 'json', 'json', 'json', 'monad json', env, (a, b, c, m) =>
    _.sequence(m, [m.of(a), m.of(b), m.of(c)]).equals(m.of([a, b, c]))
  )
  property('mapM', 'json', 'json', 'json', 'json -> monad json', 'monad json', env, (a, b, c, f, m) =>
    _.mapM(m, f, [a, b, c]).equals(f(a).chain((a) => f(b).chain((b) => f(c).chain((c) => m.of([a, b, c])))))
  )
  property('filterM', 'json', 'json', 'json', 'json -> bool', 'monad json', env, (a, b, c, f, m) =>
    _.filterM(m, (a) => m.of(f(a)), [a, b, c]).equals(m.of([a, b, c].filter(f)))
  )
  property('join', 'monad json', env, (ma) => 
    _.join(ma.of(ma)).equals(ma)
  )
})

