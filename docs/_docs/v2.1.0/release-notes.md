---
title: Release notes
prev_doc: v2.0.0
next_doc: v2.0.0/download
---

Folktale v2.1.0 is a very modest release, mostly with documentation fixes.

You can look at the [full changelog]({% link _docs/v2.1.0/changelog.md %}) for details.


## Making things more consistent

There were two inconsistent functions in Folktale 2:

  - `Future.recover` was called `.orElse` in every other data structure. A new `.orElse`
    method was added to `Future`, and consequently `.recover` has been deprecated.

  - `nullableToResult` and `Result.fromNullable` only received a nullable as a parameter,
    but the `Validation` equivalent let people define the value to use in case of null or
    undefined. These functions now optionally take a fallback value.

    The number of arguments provided to the function defines which behaviour will be used.
    This should be backwards compatible, unless you've been passing more than one argument
    to that function (which can happen in, for example, `xs.map(nullableToResult)`).


## Addressing some of the problems with `.toString`

The ADT module is still pretty experimental, and so are derivations. The derived `.toString`
method turned out to be more trouble, however:

  - If you tried serialising an object that contained objects without a `.toString` method,
    things would fail. This release fixes this problem.

  - If you try serialising an object that contains circular objects, `.toString` will recurse
    forever. This is still an open issue. [You can work around it by giving the circular object
    a custom `.toString` representation](https://github.com/origamitower/folktale/issues/167).

The big issue with `.toString` is that too many things in JavaScript will invoke it even when
you don't want that. So, yeah, this will hopefully be addressed soon.


## Acnowledgements

As always, a huge thank you to everyone who contributed to improving Folktale, by reporting errors, sending feedback, talking about it, sending patches, etc.

A special thank you to [@diasbruno](https://github.com/diasbruno), [@gvillalta99](https://github.com/gvillalta99), [@MichaelQQ](https://github.com/MichaelQQ), [@stabbylambda](https://github.com/stabbylambda), [@floriansimon1](https://github.com/floriansimon1), and [@scotttrinh](https://github.com/scotttrinh)


