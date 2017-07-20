//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

const { property } = require('jsverify');
const { union, derivations } = require('folktale/adt/union');

const { serialization, equality, debugRepresentation } = derivations;

// --[ Helpers ]--------------------------------------------------------
const methodThrowsError = method => () => {
    try {
        method();
        return false;
    }
    catch(err) {
        return true;
    }
};

describe('ADT: union', () => {
  describe('union(typeId, patterns)', () => {
    property('Constructs an union with the given type', 'json', (a) =>
      union(a, {})[union.typeSymbol] === a 
    );

    it('Creates a variant constructor for each pattern', () => {
      const { A, B, C } = union('', {
        A()    { return {}      },
        B(a)   { return { a }   },
        C(a, b){ return { a, b }}
      });

      $ASSERT(A() == {});
      $ASSERT(B(1) == { a: 1 });
      $ASSERT(C(1, 2) == { a: 1, b: 2 });
    });

    it('Constructs unions that inherit from Union', () => {
      const adt = union('', {});
      $ASSERT(Object.getPrototypeOf(adt) === union.Union);
    });

    describe('#hasInstance(value)', () => {
      property('Checks only the type tag by ref equality', 'dict nat', 'dict nat', (a, b) => {
        const x = union(a, {});
        const y = union(a, {});
        const z = union(b, {});

        return x.hasInstance(y) && y.hasInstance(x) 
        &&     !x.hasInstance(z) && !z.hasInstance(x);
      });
    });

    describe('#derive(derivation)', () => {
      it('Is invoked for each variant', () => {
        const adt = union('', {
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
        const adt = union('', {
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
        const adt = union('adt', {
          A(){ return {} }
        });

        adt.derive((variant, adt) => {
          $ASSERT(variant == { tag: 'A', type: 'adt', ..._ });
          $ASSERT(variant.prototype === adt.A.prototype);
        });
      });
    });

    describe('each union', () => {
      it('Is an instance of its constructor', () => {
        const adt = union('', {
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
        const { A, B } = union('', { 
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

      it('Blows up with a customer error message if you are missing a variant', () => {
        const { A, B } = union('', { 
          A(a) { return { a } },
          B() { return {} }
        });
        
        const matchWrapper = ()=>
            A(1).matchWith({
              B: ({ a }) => a
            }) == 'cow';

        $ASSERT(methodThrowsError(matchWrapper)() === true);
      });

      // NOTE: this fails randomly in Node 5's v8. Seems to be a v8
      // optimisation bug, although I haven't had the time to analyse
      // it yet.
      property('Gets a tag with the same name as the constructor', 'string', (a) => {
        const adt = union('', { [a](){ return {} }});
        return adt[a]()[union.tagSymbol] === a;
      });

      property('Gets a hasInstance method that only looks at type/tag', 'string', (a) => {
        const b = a + '2';
        const adt1 = union(a, { [b](){ return {} }});
        const adt2 = union(a, { [a](){ return {} }, [b](){ return {} }});
        const adt3 = union(b, { [b](){ return {} }});

        $ASSERT(adt1[b].hasInstance(adt1[b]()));
        $ASSERT(adt1[b].hasInstance(adt2[b]()));
        $ASSERT(!adt1[b].hasInstance(adt2[a]()));
        $ASSERT(!adt1[b].hasInstance(adt3[b]()));
        return true;
      });
    });
  });


  describe('Equality', () => {
    const { A, B } = union('AB', {
      A: (value) => ({ value }),
      B: (value) => ({ value })
    }).derive(equality)
    
    property('Different simple values are NOT equal', 'json', (a) => {
      return !A(a).equals(B(a))
    });
    property('Different composite values are NOT equal', 'json', (a) => {
      return !A(B(a)).equals(A(a))
    });
    property('Similar simple values are equal', 'json', (a) => {
      return A(a).equals(A(a))
    });
    property('Similar composite values are equal', 'json', (a) => {
      return A(B(a)).equals(A(B(a)))
    });

    describe('Equality#withCustomComparison', () => {

      const { A } = union('A', {
        A: (value) => ({ value }),
      }).derive(equality.withCustomComparison((a, b) => a.id === b.id));
      
      property('Values are compared using a custom function if provided', 'json', 'json', function(a, b) {
        return A({id:1, _irrelevantValue:a}).equals(A({id:1, _irrelevantValue: b}))
      });
    });
  });
  describe('Debug Representation', () => {
    const AB = union('AB', {
      A: (value) => ({ value }),
      B: (value) => ({ value })
    }).derive(debugRepresentation)

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
  describe('Serialization', () => {
    const AB = union('folktale:AB', {
      A: (value) => ({ value }),
      B: (value) => ({ value })
    }).derive(serialization, equality);
    
    const CD = union('folktale:CD', {
      C: (value) => ({value}),
      D: (value) => ({value})
    }).derive(serialization, equality);

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
