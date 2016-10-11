//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// See LICENCE for licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

const { property } = require('jsverify');
const fl = require('folktale/helpers/fantasy-land');
const defaultEquals = require('./equals');


// This file implements reusable property tests for a fantasy-land
// data structure. Each function takes two arguments:
// 
//   - A function that takes one argument, and constructs a value
//     from some fantasy-land algebra;
//   - An equality function, that takes two algebras and compares them.

const Setoid = (type) => {
  describe('Setoid instance', _ => {
    const { equals } = fl;

    property('reflexivity', 'nat', (value) => {
      const a = type(value);
      return a[equals](a) === true;
    });

    property('symmetry', 'nat', 'nat', (a, b) => {
      const SA = type(a);
      const SB = type(b);
      return SA[equals](SB) === SB[equals](SA);
    });

    property('transitivity', 'nat', (a) => {
      const SA = type(a);
      const SB = type(a);
      const SC = type(a);

      return SA[equals](SB)
      &&     SB[equals](SC)
      &&     SA[equals](SC)  
    });    
  });
};


const Semigroup = (type, equals = defaultEquals) => {
  const { concat } = fl;

  describe('Semigroup instance', _ => {
    property('associativity', 'string', 'string', 'string', (a, b, c) =>
      equals(
        type(a)[concat](type(b))[concat](type(c)),
        type(a)[concat](type(b)[concat](type(c)))
      )
    );
  });
};


const Monoid = (type, equals = defaultEquals) => {
  const { concat, empty } = fl;

  describe('Monoid instance', _ => {
    property('right identity', 'string', (a) =>
      equals(type(a)[concat](type[empty]()), type(a))
    );

    property('left identity', 'string', (a) =>
      equals(type()[empty]()[concat](type(a)), type(a))
    );
  });
};


const Functor = (type, equals = defaultEquals) => {
  const { map } = fl;

  describe('Functor instance', _ => {
    property('identity', 'nat', (a) =>
      equals(type(a)[map](a => a), type(a))
    );

    property('composition', 'nat', 'nat -> nat', 'nat -> nat', (a, f, g) =>
      equals(
        type(a)[map](x => f(g(x))),
        type(a)[map](g)[map](f)
      )
    );
  });
};


const Apply = (type, equals = defaultEquals) => {
  const { ap, map } = fl;

  describe('Apply instance', _ => {
    property('composition', 'nat', 'nat -> nat', 'nat -> nat', (a, f, g) =>
      equals(
        type(a)[ap](type(g)[ap](type(f)[map](f => g => x => f(g(x))))),
        type(a)[ap](type(g))[ap](type(f))
      )
    );
  });
};


const Applicative = (type, equals = defaultEquals) => {
  const { ap, of } = fl;

  describe('Applicative instance', _ => {
    property('identity', 'nat', (a) =>
      equals(
        type()[of](a)[ap](type(x => x)),
        type(a)
      )
    );

    property('homomorphism', 'nat', 'nat -> nat', (a, f) =>
      equals(
        type()[of](a)[ap](type()[of](f)),
        type()[of](f(a))
      )
    );

    property('interchange', 'nat', 'nat -> nat', (a, f) =>
      equals(
        type()[of](a)[ap](type(f)),
        type(f)[ap](type()[of](f => f(a)))
      )
    );
  });
};


const Chain = (type, equals = defaultEquals) => {
  const { chain } = fl;

  describe('Chain instance', _ => {
    property('associativity', 'nat', 'nat -> nat', 'nat -> nat', (a, rf, rg) => {
      const f = (x) => type(rf(x));
      const g = (x) => type(rg(x));

      return equals(
        type(a)[chain](f)[chain](g),
        type(a)[chain](x => f(x)[chain](g))
      )
    });
  });
};


const Monad = (type, equals = defaultEquals) => {
  const { chain, of } = fl;

  describe('Monad instance', _ => {
    property('left identity', 'nat', 'nat -> nat', (a, rf) => {
      const f = (x) => type(rf(x));

      return equals(
        type()[of](a)[chain](f),
        f(a)
      )
    });

    property('right identity', 'nat', (a) => 
      equals(
        type(a)[chain](x => type()[of](x)),
        type(a)
      )
    );
  });
};


const Bifunctor = (type, equals = defaultEquals) => {
  const { bimap } = fl;

  describe('Bifunctor instance', _ => {
    property('identity', 'nat', 'nat', (a, b) => 
      equals(
        type(a, b)[bimap](a => a, b => b),
        type(a, b)
      )
    );

    property('composition', 'nat', 'nat', 'nat -> nat', 'nat -> nat', 'nat -> nat', 'nat -> nat', (a, b, f, g, h, i) =>
      equals(
        type(a, b)[bimap](
          a => f(g(a)),
          b => h(i(b))
        ),
        type(a, b)[bimap](g, i)[bimap](f, h)
      )
    );
  });
};


module.exports = {
  Setoid,
  Semigroup,
  Monoid,
  Functor,
  Apply,
  Applicative,
  Chain,
  Monad,
  Bifunctor
};
