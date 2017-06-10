---
title: Type notation
prev_doc: v2.0.0/misc/design-principles
---

JavaScript is a dynamically typed language, meaning that we generally have no way of adding type annotation to functionality, and there's also no way of checking them. Tools like TypeScript and Flow help by adding their own type system, so that information can be provided and checked, but ultimately they're not powerful enough to describe some of the features Folktale uses.

We still think that types, even when not checked, are a powerful tool for concisely describing what one can expect of a piece of functionality. It answer questions such as "what does this piece of functionality expect me to provide?", and "what can I get out of this piece of functionality?", but also things like "can I combine this and that piece of functionality?", "is there anything I have to watch out for when using this functionality?", and others.

Since those are all valuable questions to answer, every functionality in Folktale describes its "type", and this document describes that particular notation.


## Type system overview

The system Folktale uses is a *structural* type system. That means that two types are considered compatible if they have the same structure (roughly, if two objects have the same properties, they're "compatible"). This closely models Object-Oriented and dynamic language idioms, but is also commonly used in Functional languages. Folktale uses some OO concepts and some FP concepts, so this kind of system fits.

The document uses the term `x matches y` to mean that the object or type `y` is compatible with the object or type `x`. So, if we say that "Boolean matches a JS primitive boolean", we're pretty much saying that values like `true` or `false` are compatible with the type `Boolean`.

In a type system, values may only occur where a compatible type is specified. That is, if we have a function like:

```js
/*~ type: (Number, Number) => Number */
function add(a, b) {
  return a + b;
}
```

Then the type annotation describes that both of its parameters must be compatible with a JavaScript number, and the value it returns will also be compatible with a number. So:

```js
// OK:
add(1, 2); // => 3  (all numbers)

// Not OK:
add(1, "2"); // "2" is not compatible with Number
``` 


## Basic types

### Primitive types

A primitive type is the most basic type in the system. Each of the following types is unique, and reflects JavaScript primitive values:

  - `Undefined` — matches the value `undefined`
  - `Null` — matches the value `null`
  - `Number` — matches any primitive numeric value (e.g.: `1`)
  - `String` — matches any primitive textual value (e.g.: `"foo"`)
  - `Boolean` — matches any primitive boolean value (e.g.: `true`)


### The `Any` type

The `Any` type is a special type that all JavaScript values are compatible with.

```js
type
  Any

// Matches the type: EVERYTHING
1;
'foo';
null;
{ a: 1 };
...
```


### Tuple types

A tuple type is a sequence of types with a fixed size. Think of it as an array that is always guaranteed to have the same number of elements, and in the same order. In order to describe a tuple type we use the `,` operator:

```js
type
  Number, String

// Matches the type
[1, "hello"];

// Does not match the type
[1];
["hello", 1];
```


### Record types

A record type is a collection of key/type pairs that is matched substructurally. That is, objects are considered compatible with the type if they contain at least those keys, and whose values are compatible with the type defined for it.

For example:

```js
type
  { x: Number, y: Number }

// Matches the type
{ x: 1, y: 2 };
{ x: 1, y: 2, z: 3 };

// Does not match the type
{ x: '1', y: 2 }; // `x` is a String
{ x: 1, z: 3 };   // missing `y`
```


### Function types

A function type describes the input and output of a function, alongside with its effects (if any).

In the simplest form, the type of a function describes the types of its parameters, and the type of its return value:

```js
// A function with no arguments
type
  () => Number

// Matches the type
() => 1;

// Does not match the type
(a) => 1;   // has one parameter
() => '1';  // returns a string


// A function with some arguments
type
  (Number, Number) => Number

// Matches the type
(a, b) => a + b;

// Does not match the type
(a, b, c) => a + b + c;  // has three parameters
(a) => a;                // has one parameter
(a, ...b) => a;          // has a variadic parameter
(a, b) => a.toString();  // returns a string
```

Sometimes functions in JavaScript take an arbitrary number of arguments. These functions are called "variadic", and they are explicitly marked in the type as such with the `...` operator:

```js
type
  (Number, ...String) => String

// Matches the type
(chars, ...texts) => texts.map(x => x.slice(0, chars)).join('');
(chars, texts) => '';

// Does not match the type
(chars) => chars;        // has one parameter
(chars, ...texts) => 1;  // returns a number
```

Sometimes JavaScript functions do something outside of just taking in and returning values, and it might be nice to capture those. These things are commonly called "effects", and to capture them we have what's called an "effects list", which describes the effects a function has. Examples of effects are things like throwing an error, or mutating an object.

For example:

```js
type
  (Number) => Number :: throws RangeError

// Matches the type
(n) => {
  if (n < 1) {
    throw new RangeError(`Expected a number >= 1, got ${n}`);
  }
  return 5 / n;
};


// Does not match the type
(n) => {
  if (n < 1) {
    throw new TypeError(`Invalid value: ${n}`);
  }
  return 3;
}; // throws a TypeError, not a RangeError


(n) => 3; // does not throw
```

Effects are discussed in more details later in this document.

Finally, a function type may accept a special parameter, accessible as `this` inside of that function. This particular object-oriented feature is captured with the `.` operator:

```js
type
  ({ name: String }).() => { name: String }

// Matches the type
function () {
  return { name: this.name.toUpperCase() };
}

function () {
  this.name = this.name.toUpperCase();
  return this;
}

// Does not match the type
function (person) {
  return { name: person.name.toUpperCase() };
} // uses a positional parameter, not a this parameter

function () {
  this.name = this.name.toUpperCase();
} // does not return an object with a 'name' field
```


## Type combinations

### Union types

An union type describes something that matches any of the described types. It uses the `or `operator:

```js
type
  String or Null

// Matches the type
'foo';
null;

// Does not match the type
1;
false;
undefined;
```


### Intersection types

An intersection type describes something that has many different characteristics at the same time. A value still must possess all of these characteristics in order to be compatible with the type. Intersections use the `and `operator.

Some types are nonsensical with intersections, for example `String and Null` describes a value that is, at the same time, `null` and a String. Such value does not exist in JavaScript.

On the other hand, intersection types are useful for describing function types where they may behave differently depending on the parameters given to them. For example:

```js
type
    (Number) => Number
and (String) => String

// Matches the type
(value) => {
  if (typeof value === 'number') {
    return value + 1;
  } else {
    return value + '!';
  }
};

(value) => value; // supports at least the two cases


// Does not match the type
(value) => value + 1;   // only supports (Number) => Number
(value) => value + '!'; // only supports (String) => String
```


## Type aliases

A type alias may be defined in two ways. First, any type may be given a name by the `type` keyword:

```js
type Point2d = { x: Number, y: Number }
```

The name on the left side of the `=` and the type on the right side are exact the same, but naming more complex types helps with making some type expressions easier to understand, by reducing the amount of information one has to understand at once.

The other way of providing a type alias is with the `:` operator in a type expression:

```js
// This:
(a: Number, a) => a

// Is the same as:
(Number, Number) => Number
```

With record types, an alias is already created for each field, but you may provide an additional alias:

```js
// This:
{ x: (the_x: Number), y: x, z: the_x }

// Is the same as:
{ x: Number, y: Number, z: Number }
```


## Type variables

Sometimes a functionality uses an arbitrary type, and we want to make sure that this arbitrary type is the same everywhere. For example, if we write:

```js
type
  (Any) => Any
```

Then `(n) => n` is compatible with it, but so is `(n) => 1`. There's no requirement that the type of the input be the exact same as the type of the output. In order to fix that, we can use type variables:

```js
type
  forall a: (a) => a

// Matches the type
(n) => n

// Does not match the type
(n) => n + n;  // `a` is not any known type, we can't use it
(n) => 1;      // 1 is not compatible with abstract type `a`
```

Note that now we introduce a type variable `a` with `forall`. More variables can be introduced by separating them with commas. A type variable is an abstract type, so it only matches itself, and there's no way of constructing a value of such type, or operating on such type. The only possible operations are receiving such value as a parameter, and passing such value as an argument.


## Parameterised types

Some types (like `Array`) contain other types, and ideally we should be able to specify which types they contain. This uses the type variables described early:

```js
type Tuple a b = (a, b)

[1, "foo"];     // Matches "Tuple Number String"
["foo", "foo"]; // Matches "Tuple String String"
```

In order to use these types, we just juxtapose the types that will replace the variables to the type name. An array, for example, is a container of elements of type `a`, so:

```js
type
  Array Number

// Matches the type
[1, 2, 3];
[1];
[];

// Does not match the type
[1, '2', 3];  // Number or String
['2'];        // String
```


## Type constraints

A type constraint restricts an existing type in some way. Commonly this is used to specify some characteristics for abstract types (see the section on Type Parameters), so people know what they can do with those values.

Constraints are defined in the `where` clause. Currently, the only constraint supported by this notation is the `A is B`, which restricts `A` to objects that also implement the type described by `B`:

```js
type Semigroup a = {
  concat: (a).(a) => a
}

type
  forall S, a: (S a).(S a) => S a
  where S is Semigroup

// Matches the type
function concat(a, b) {
  return a.concat(b);
}
```


## A summary of the types

```js
// -- Primitives
type Null         // matches null
type Undefined    // matches undefined
type String       // matches 'string'
type Boolean      // matches true
type Number       // matches 1

type None = Null or Undefined
type Void = Undefined


// -- Built-ins
type RegExp
type Symbol
type Date
type Int8Array
type Uint8Array
type Uint8ClampedArray
type Int16Array
type Uint16Array
type Int32Array
type Uint32Array
type Float32Array
type Float64Array
type ArrayBuffer
type DataView
type Proxy

type Error
type EvalError      <: Error
type InternalError  <: Error
type RangeError     <: Error
type ReferenceError <: Error
type SyntaxError    <: Error
type TypeError      <: Error
type URIError       <: Error

type Function = (...Any) => Any


// -- Parameterised types
type Object values
type Array elements
type Map keys values
type Set values
type WeakMap keys values
type WeakSet keys values
type Promise value error
type Generator value


// -- Effects
effect throws types
effect mutates types
effect io
```