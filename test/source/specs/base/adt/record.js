//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------
const { property } = require('jsverify');
const { record, derivations } = require('folktale/adt/record');

const { serialization, equality, debugRepresentation } = derivations;

// --[ Helpers ]--------------------------------------------------------
const methodThrowsError = (method, error, message) => {
    try {
        method();
        return false;
    }
    catch(err) {
        return err instanceof error && err.message === message;
    }
};

const typeMatches = {
  number: Number,
  string: String,
  symbol: Symbol,
  boolean: Boolean,
  object: Object,
  function: Function,
  undefined: undefined,
  null: null
};

//
// Get type for forall tests
// 
const typeOf = value => typeMatches[value != null ? typeof value : value];

describe('ADT: record', () => {
  describe('record(typeId, structure)', () => {
    it('Creates a record constructor with primitives', () => {
      const A = record('A', { a: Number, b: String });
      const a = A({ a: 0, b: '' });
      $ASSERT(a == { a: 0, b: '' });
      $ASSERT(a instanceof A);
    });

    it('Creates a record constructor with reference type', () => {
      const A = record('A', { a: Date });
      const now = new Date(); 
      const a = A({ a: now });
      $ASSERT(a == { a: now });
    });

    it('Creates a record constructor with record type', () => {
      const A = record('A', { a: Number });
      const B = record('B', { a: A });
      const b = B({ a: A({ a: 42 }) });
      $ASSERT(b == { a: { a: 42 } });
    });

    it('Creates a record constructor with undefined type', () => {
      const A = record('A', { a: undefined });
      const a = A({ a: undefined });
      $ASSERT(a == { a: undefined });
    });

    it('Creates a record constructor with undefined type', () => {
      const A = record('A', { a: null });
      const a = A({ a: null });
      $ASSERT(a == { a: null });
    });

    it('Created record is immutable', () => {
      const A = record('A', { a: Number });
      const a = A({ a: 0 });
      const fn = () => {
        a.a = 1;
      };
      $ASSERT(methodThrowsError(fn, TypeError, 'Cannot assign to read only property \'a\' of object \'[object Object]\''));
    });

    it('Created record with wrong primitive types should throw error', () => {
      const A = record('A', { a: Number });
      const fn = () => {
        const a = A({ a: 'NOT A NUMBER' });
      };
      $ASSERT(methodThrowsError(fn, TypeError, '\'a\' type Number does not match with type String'));
    });

    it('Created record with wrong reference types should throw error', () => {
      const A = record('A', { a: Array });
      const fn = () => {
        const a = A({ a: () => {}});
      };
      $ASSERT(methodThrowsError(fn, TypeError, '\'a\' type Array does not match with type Function'));
    });

    it('Created record with wrong record types should throw error', () => {
      const A = record('A', { a: Array });
      const B = record('B', { a: A });
      const fn = () => {
        const b = B({ a: () => {}});
      };
      $ASSERT(methodThrowsError(fn, TypeError, '\'a\' type A does not match with type Function'));
    });

    describe('#derive(derivation)', () => {
      it('May change the prototype of the constructor', () => {
        const adt = record('', {});
        const a = adt({});
        adt.derive((constructor, adt) => {
          constructor.prototype.f = () => 1
        });
        const b = adt({});

        $ASSERT(a.f() == 1);
        $ASSERT(b.f() == 1);
      });
    });
  });

  describe('Equality', () => {
    property('Different simple values are NOT equal', 'json', (a) => {
      const A = record('A', { a: typeOf(a) }).derive(equality)
      const B = record('B', { a: typeOf(a) }).derive(equality)
      return !A({ a }).equals(B({ a }))
    });

    property('Similar simple values are equal', 'json', (a) => {
      const A = record('A', { a: typeOf(a) }).derive(equality)
      return A({ a }).equals(A({ a }))
    });

    describe('Equality#withCustomComparison', () => {
      const A = record('A', {
        id: Number
      }).derive(equality.withCustomComparison((a, b) => a.id === b.id));
      
      property('Values are compared using a custom function if provided', 'json', 'json', function(a, b) {
        return A({id:1, _irrelevantValue:a}).equals(A({id:1, _irrelevantValue: b}))
      });
    });
  });

  describe('Debug Representation', () => {
    property('Types have a string representation', () => {
      const A = record('A', { value: Number }).derive(debugRepresentation);
      return A.toString()  === 'A';
    })

    property('Primitive Values have a string representation', () => {
      const A = record('A', { value: Number }).derive(debugRepresentation);
      return A({ value: 1 }).toString()  === 'A({ value: 1 })';
    })
    property('Special IEEE 754 values have a correct string representation', () => {
      const A = record('A', { value: Number }).derive(debugRepresentation);
      return A({ value: NaN }).toString() === 'A({ value: NaN })'
      &&     A({ value: Infinity }).toString() === 'A({ value: Infinity })'
      &&     A({ value: -Infinity }).toString() === 'A({ value: -Infinity })'
      &&     A({ value: -0 }).toString() === 'A({ value: -0 })'
    });
    property('Complex Values have a string representation', () => {
      const A = record('A', { value: Object }).derive(debugRepresentation)
      return A({ value: { foo: "bar" } }).toString()  === 'A({ value: { foo: "bar" } })';
    });
    property('Complex Values have a string representation', () => {
      const Baz = record('Baz', { foo: String }).derive(debugRepresentation);
      const A = record('A', { baz: Baz }).derive(debugRepresentation)
      return A({ baz: Baz({ foo: "bar" }) }).toString()  === 'A({ baz: Baz({ foo: "bar" }) })';
    });
    property('Named functions have a string representation', () => {
      const A = record('A', { value: Function }).derive(debugRepresentation)
      return A({ value: function foo(){ } }).toString()  === 'A({ value: [Function: foo] })';
    })

    property('Symbols have a string representation', () => {
      const A = record('A', { value: Symbol }).derive(debugRepresentation)
      // Older engines don't have proper Symbol representations, so we account for
      // es6-shim stuff here
      return /A\({ value: Symbol\(foo\)\S* }\)/.test(A({ value: Symbol('foo') }).toString());
    })

    property('ADTs containing objects with custom .toString get serialised properly', () => {
      const a = { toString(){ return 'hello' }};
      const A = record('A', { value: Object }).derive(debugRepresentation);
      return A({ value: a }).toString() === 'A({ value: hello })'
    });

  describe('Serialization', () => {
    const A = record('folktale:A', {
      value: Object
    }).derive(serialization, equality);
    
    property('Serializing a value and deserializing it yields a similar value', 'json', value => {
      const A = record('folktale:A', {
        value: typeOf(value)
      }).derive(serialization, equality);
      return A.fromJSON(A({ value }).toJSON()).equals(A({ value }))
    })
  });
});
