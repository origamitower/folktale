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
const {data, setoid, show, serialize} = require('folktale/core/adt')

describe('Core.ADT', () => {
  describe('data(typeId, patterns)', () => {
    property('Constructs an ADT with the given type', 'json', (a) =>
      data(a, {})[data.typeSymbol] === a 
    );

    it('Creates a variant constructor for each pattern', () => {
      const { A, B, C } = data('', {
        A()    { return {}      },
        B(a)   { return { a }   },
        C(a, b){ return { a, b }}
      });

      $ASSERT(A() == {});
      $ASSERT(B(1) == { a: 1 });
      $ASSERT(C(1, 2) == { a: 1, b: 2 });
    });

    it('Constructs ADTs that inherit from ADT', () => {
      const adt = data('', {});
      $ASSERT(Object.getPrototypeOf(adt) === data.ADT);
    });

    describe('#hasInstance(value)', () => {
      property('Checks only the type tag by ref equality', 'dict nat', 'dict nat', (a, b) => {
        const x = data(a, {});
        const y = data(a, {});
        const z = data(b, {});

        return x.hasInstance(y) && y.hasInstance(x) 
        &&     !x.hasInstance(z) && !z.hasInstance(x);
      });
    });

    describe('#derive(derivation)', () => {
      it('Is invoked for each variant', () => {
        const adt = data('', {
          A(){ return {} },
          B(){ return {} },
          C(){ return {} }
        });

        let visited = {};
        adt.derive((variant, adt) => {
          visited[variant.tag] = true;
        });

        $ASSERT(visited == { A: true, B: true, C: true });
      });

      it('May change the prototype of the variant', () => {
        const adt = data('', {
          A(){ return {} }
        });

        const a = adt.A();
        adt.derive((variant, adt) => {
          variant.prototype.f = () => 1
        });
        const b = adt.A();

        $ASSERT(a.f() == 1);
        $ASSERT(b.f() == 1);
      });

      it('Provides an object of the Variant interface', () => {
        const adt = data('adt', {
          A(){ return {} }
        });

        adt.derive((variant, adt) => {
          $ASSERT(variant == { tag: 'A', type: 'adt', ..._ });
          $ASSERT(variant.prototype === adt.A.prototype);
        });
      });
    });

    describe('each ADT', () => {
      it('Is an instance of its constructor', () => {
        const adt = data('', {
          A(){ return {} },
          B(){ return {} }
        });
        const { A, B } = adt;

        $ASSERT(adt.isPrototypeOf(A()));
        $ASSERT(A() instanceof A);
        $ASSERT(B() instanceof B);
        $ASSERT(!(A() instanceof B));
      });

      it('Gets a matchWith method for pattern matching', () => {
        const { A, B } = data('', { 
          A(a) { return { a } },
          B(a, b) { return { a, b } }
        });

        $ASSERT(
          A(1).matchWith({
            A: ({ a }) => a,
            B: ({ a, b }) => a + b
          })
          == 1
        );

        $ASSERT(
          B(1, 2).matchWith({
            A: ({ a }) => a,
            B: ({ a, b }) => a + b
          })
          == 3
        );
      });

      // NOTE: this fails randomly in Node 5's v8. Seems to be a v8
      // optimisation bug, although I haven't had the time to analyse
      // it yet.
      property('Gets a tag with the same name as the constructor', 'string', (a) => {
        const adt = data('', { [a](){ return {} }});
        return adt[a]()[data.tagSymbol] === a;
      });

      property('Gets a hasInstance method that only looks at type/tag', 'string', (a) => {
        const b = a + '2';
        const adt1 = data(a, { [b](){ return {} }});
        const adt2 = data(a, { [a](){ return {} }, [b](){ return {} }});
        const adt3 = data(b, { [b](){ return {} }});

        $ASSERT(adt1[b].hasInstance(adt1[b]()));
        $ASSERT(adt1[b].hasInstance(adt2[b]()));
        $ASSERT(!adt1[b].hasInstance(adt2[a]()));
        $ASSERT(!adt1[b].hasInstance(adt3[b]()));
        return true;
      });
    });
  });


  describe('Setoid', () => {
    const { A, B } = data('AB', {
      A: (value) => ({ value }),
      B: (value) => ({ value })
    }).derive(setoid)
    
    property('Different simple values are NOT equal', 'json', (a) => {
      return !A(a).equals(B(a))
    });
    property('Different composite values are NOT equal', 'json', (a) => {
      return !A(B(a)).equals(A(a))
    });
    property('Similar simple values are equal', 'json', (a) => {
      return A(a).equals(A(a))
    });
    property('Similar array values are equal', 'json', (a, b) => {
      return A([a, b]).equals(A([a, b]))
    });
    property('Similar composite values are equal', 'json', (a) => {
      return A(B(a)).equals(A(B(a)))
    });

    describe('Setoid#withEquality', () => {

      const { A } = data('A', {
        A: (value) => ({ value }),
      }).derive(setoid.withEquality((a, b) => a.id === b.id));
      
      property('Values are compared using a custom function if provided', 'json', 'json', function(a, b) {
        return A({id:1, _irrelevantValue:a}).equals(A({id:1, _irrelevantValue: b}))
      });
    });
  });
  describe('Show', () => {
    const AB = data('AB', {
      A: (value) => ({ value }),
      B: (value) => ({ value })
    }).derive(show)

    property('Types have a string representation', () => {
      return AB.toString()  === 'AB';
    })

    property('Variants have a string representation', () => {
      return AB.A.toString()  === 'AB.A';
    })
    property('Primitive Values have a string representation', () => {
      return AB.A(1).toString()  === 'AB.A({ value: 1 })';
    })
    property('Complex Values have a string representation', () => {
      return AB.A({foo: "bar"}).toString()  === 'AB.A({ value: { foo: "bar" } })';
    })
    property('Functions have a string representation', () => {
      return AB.A((a) => a ).toString()  === 'AB.A({ value: [Function] })';
    })
    property('Named functions have a string representation', () => {
      return AB.A(function foo(){ }).toString()  === 'AB.A({ value: [Function: foo] })';
    })

    property('Symbols have a string representation', () => {
      // Older engines don't have proper Symbol representations, so we account for
      // es6-shim stuff here
      return /AB\.A\({ value: Symbol\(foo\)\S* }\)/.test(AB.A(Symbol('foo')).toString());
    })
    property('Recursive Values have a string representation', () => {
      return AB.A({rec:AB.A(1)}).toString()  ===  'AB.A({ value: { rec: AB.A({ value: 1 }) } })'
    })
  });
  describe('Serialize', () => {
    const AB = data('folktale:AB', {
      A: (value) => ({ value }),
      B: (value) => ({ value })
    }).derive(serialize, setoid);
    
    const CD = data('folktale:CD', {
      C: (value) => ({value}),
      D: (value) => ({value})
    }).derive(serialize, setoid);

    const {A, B} = AB;
    const {C, D} = CD;

    property('Serializing a value and deserializing it yields a similar value', 'json', (a) => {
      return AB.fromJSON(A(a).toJSON()).equals(A(a))
    })
    property('Serializing a *recursive* value and deserializing it yields a similar value', 'json', (a) => {
      return AB.fromJSON(A(B(a)).toJSON()).equals(A(B(a)))
    })

    property('Serializing a *composite* value and deserializing it yields a similar value (when the proper parsers are provided).', 'json', (a) => {
      return AB.fromJSON(A(B(C(a))).toJSON(), {AB, CD}).equals(A(B(C(a))))
    })
  });
});
