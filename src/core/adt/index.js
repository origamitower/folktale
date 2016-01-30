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


// All ADT objects inherit from ADT, so this allows common behaviour
// to be shared here.
const ADT = {
  derive(...derivations) {
    derivations.forEach(derivation => {
      this.variants.forEach(variant => derivation(variant, this));
    });
    return this;
  }
};


// A helper for mapping values in an object.
const mapObject = (object, transform) =>
        Object.keys(object).reduce((result, key) => {
          result[key] = transform(key, object[key]);
          return result;
        }, {});


// A helper for constructing variants given an object with the
// variant patterns.
//
// A pattern is an object in the form of `{ String -> [String] }`,
// and this function returns an object of the form:
//
//     { name: string,
//       constructor: Constructor,
//       prototype: Object,
//       fields: [String]
//     }
//
// All constructors inherit from the `namespace` constructor's
// prototype.
//
// Each Variant includes a few reflective methods, and a pattern
// matching/catamorphism method.
const defineVariants = (patterns, namespace) => {
  return mapObject(patterns, (name, fields) => {
    function ADT_Variant(data) {
      for (var i = 0; i < fields.length; ++i) {
        var key = fields[i];
        this[key] = data[key];
      }
    };
    ADT_Variant.prototype = Object.create(namespace.prototype);
    Object.assign(ADT_Variant.prototype, {
      ['is' + name]: true,
      tag: name,
      fields: fields,
      cata(pattern) {
        return pattern[name](this);
      }
    });

    return {
      name: name,
      constructor: ADT_Variant,
      prototype: ADT_Variant.prototype,
      fields: fields
    };
  });
};


// Given a set of patterns, constructs an ADT structure.
const data = (patterns) => {
  function ADT_Namespace() { };

  const variants = defineVariants(patterns, ADT_Namespace);

  ADT_Namespace.prototype = Object.create(ADT);
  Object.assign(ADT_Namespace.prototype, {
    variants
  });

  return ADT_Namespace;
};


data.ADT = ADT;
module.exports = data;


// -- Annotations ------------------------------------------------------
if (process.env.NODE_ENV !== "production") {
  ADT[Symbol.for('@@meta:magical')] = {
    name: 'ADT',
    category: 'Data Structures',
    type: 'ADT { variants: [Variant] }',
    tags: ['Sum Types', 'Algebraic Data Structures'],
    belongsTo: data,
    documentation: `
The basis of all algebraic data types.

ADT is used basically to share some methods for refining data structures
created by this module, derivation being one of them.
    `
  };

  ADT.derive[Symbol.for('@@meta:magical')] = {
    name: 'derive',
    signature: '.derive(...derivation)',
    type: 'ADT . (...(Variant, ADT) -> Void) -> ADT',
    category: 'Refinement',
    belongsTo: ADT,
    documentation: `
Allows a function to provide functionality to variants in an ADT.

The \`derive\` method exists to support meta-programming on ADT objects,
such that additional functionality (implementation of interfaces or
protocols, for example) may be provided by libraries instead of having
to be hand-coded by the user.

The operation accepts many \`derivation\` functions, which will be invoked
for each variant in the ADT, where a Variant is just an object with the
following attributes:

    interface Variant {
      name        : String,
      constructor : Constructor,
      prototype   : Object,
      fields      : [String]
    }

A derivation function can then use this information to include new
operations on the variant. For example, a JSON derivation could be
implemented as follows:

    const ToJSON = (variant, adt) => {
      const fields = variant.fields;
      const tag = variant.name;
      variant['toJSON'] = function() {
        const json = { tag: tag };
        fields.forEach(k => json[k] = this[k]);
        return json;
      }
    }

And used as such:

    const List = data({
      Nil: [],
      Cons: ['head', 'tail']
    }).derive(ToJSON);

    new List.Nil().toJSON()
    // => { tag: 'Nil' }

    new List.Cons({ head: 1, tail: new List.Nil() })
    // => { tag: 'Cons', head: 1, tail: { tag: 'Nil' }}
    `
  };

  data[Symbol.for('@@meta:magical')] = {
    name: 'data',
    signature: 'data(patterns)',
    type: '({ String -> [String] }) -> ADT',
    category: 'Data Structures',
    stability: 'experimental',
    platforms: ['ECMAScript 2015'],
    portability: 'Older ES versions supported through es6-shim, and es5-shim',
    authors: ['Quildreen Motta'],
    module: 'folktale/core/adt',
    licence: 'MIT',
    seeAlso: [
      {
        type: 'link',
        title: 'Designing with types: Making illegal states unrepresentable',
        url: 'http://fsharpforfunandprofit.com/posts/designing-with-types-making-illegal-states-unrepresentable/'
      }
    ],
    documentation: `
Constructs a sum data structure.

## Example

    const List = data({
      Nil: [],
      Cons: ['head', 'tail']
    });

    const { Nil, Cons } = List;
    let abc = new Cons({
      head: 'a',
      tail: new Cons({
        head: 'b',
        tail: new Cons({
          head: 'c',
          tail: new Nil()
        })
      })
    });


It's recommended to provide wrappers for the constructors:

    const cons = (head, tail) => new Cons({ head, tail });
    const nil  = _ => new Nil();

    let abc = cons('a', cons('b', cons('c', nil())));


## Why?

JavaScript, as most languages, only really supports product types
out of the box. This means that we can easily model data structures that
are a composition of several independent pieces of data, however it also
means that as soon as we need to model a different kind of data structure,
like one where the fields vary depending on its type, we're on our own.

For correctly modelling something, we usually want to have both product
(the composition of independent pieces of data) and sum (a choice between
one of many possibilities) types. This module provides the missing *sum*
support for JavaScript.


## Architecture


    `
  };
}
