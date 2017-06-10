---
title: Design principles
prev_doc: v2.0.0/misc/stability-index
next_doc: v2.0.0/misc/type-notation
---

There are some principles that guide the design of Folktale 2. This document describes these principles.


## Contents
{:.no_toc}

* TOC
{:toc}


## Arrow functions over currying

Curried functions can be composed in several ways. And this is a good
thing, because it means it's easier to create new functionality by combining
existing ones. However, in an untyped language, you have no way of
enforcing a correct composition of functions, so currying in JS tends to
lead to silent or late errors. Coupled with JavaScript's heavy use of
variadic functions, and the VM's unhelpful error reporting, these have the
potential for being very frustrating, especially for people new to FP.

ES2015 lessens a bit the burden of being more explicit with your
composition, since arrow functions have less visual overhead, and can
enforce some compositional constraints syntactically. They also side-step
the problems with JavaScript's variadic functions to an extent.


## Free-method versions of functions

JavaScript's syntax is limited, but some of the proposed additions to it
lead to programs that are easier to read. One of them is the
[This-Binding syntax](https://github.com/zenparsing/es-function-bind), which
allows using functions in infix position:

```js
const _groupBy = require('folktale/core/iterator/group-by');

function groupBy(f) {
  return _groupBy(this, f);
}

[1, 2, 3, 4, 5]::groupBy(isOdd)
// => _groupBy([1, 2, 3, 4, 5], isOdd)

// Some combinators may be provided specifically to use as infix
list.sort(compare::on(first))
// => list.sort(on(compare, first))
```

## Reuse the language's native methods

Where possible, as long as laws aren't broken, reuse the language's native methods.
This makes it easier to combine Folktale with existing projects and
libraries, as they'd have similar expectations.


## Monolithic package

There are plenty of advantages of micro-libraries. They are more modular,
since they have to work with less expectations; they are easier to replace;
we can make a better use of semantic versioning; and they are easier to
understand.

But there are plenty of drawbacks to them as well:

  - **They're harder to use when you need to combine more than one
    module**. For example, if you want an Either module to be able to convert
    its values to a Maybe structure, you need to provide the Either module
    with the Maybe structure to use. This, while modular, adds some friction
    for people to use these features, which goes against our aim to make
    functional programming easier to newcomers.

  - **They're harder to maintain**. Keeping modules, tooling, and issues in
    sync between different modules takes much more effort, and it's easy to
    miss things. When all of the modules are related anyway, you'll have to
    keep them in sync all the time.

  - **They're less consistent**. Because each module is independent, exposes
    its own API, and evolves at its own pace, it's easy to get inconsistent
    behaviour across them. This was the case with how methods worked in the
    old versions of Maybe, Either, and Validation.


## Interactive (REPL) development

One of the long-term goals with Folktale is to have really good support
for interactive development in the REPL. The first step for that is to be
able to view documentation directly from the REPL, which is being done by
annotating objects with the
[Meta:Magical](https://github.com/origamitower/metamagical) library.

As newer features get added to Meta:Magical, like searching functions by
approximate type signature, Folktale and its users will benefit from them
without having to do anything.


## Logically grouped, minimal modules
    
Each module should be entirely self-contained, and only provide the
absolute minimum necessary for that particular functionality. Most of the
time this will mean `one function = one module`, but not always. See the
`folktale/adt/union` module, and the
[Siren's Platform Design document](https://github.com/siren-lang/siren/blob/master/documentation/platform-design.md)
for examples.

There are two reasons behind this:

  1. Extracting a minimal application from a large framework/environment
    (tree-shaking) requires full type inference in JavaScript, because
    modules are first class, and you need to know which properties of which
    objects are accessed where. For historical data on this, see the
    [report on Foundations of Object-Oriented Languages](http://www.cs.cmu.edu/~aldrich/FOOL/FOOL1/FOOL1-report.pdf)
    and Aegesen at al's work on
    [type inference for Self](http://bibliography.selflanguage.org/type-inference.html).

  2. Because all modules are annotated, inline, for the Meta:Magical library,
    even modules comprised of simple, one line functions end up being more
    than 40 lines of code when you consider documentation.


## Modules are grouped in an hierarchy of categories

This is mostly to make using the libraries easier given the previous
point. Modules that are higher in the hierarchy should re-export all
features below it. This allows people to require a bag of things, like
`require('folktale/result')`, or a very specific functionality, when
they are concerned about the resulting size of the application (if they are
deploying to a Browser, for example), like
`require('folktale/result/from-nullable')`.
