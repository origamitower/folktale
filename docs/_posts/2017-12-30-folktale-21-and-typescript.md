---
layout: blog
title:  "Folktale 2.1 and TypeScript Support"
group:  blog
---

Hello everyone~

I had this release planned for just before New Year's but I wasn't feeling well so that didn't happen.

Anyway. There are two releases today: Folktale 2.1, and some experimental TypeScript support in the next release, Folktale 3.x.

<!--more-->


## A modest iteration: Folktale 2.1

The Foltkale 2.1 release is very modest, and mostly includes documentation and bug fixes.
You can look at the [release notes]({% link _docs/v2.1.0/release-notes.md %}) and 
[full changelog]({% link _docs/v2.1.0/changelog.md %}) for details.

In essence, this fixes some issues with inconsistent functions (adding new signatures
and functions in the process), and fixes part of the problem with the derived `.toString`
function in ADTs. This function still doesn't handle circular objects, but a fix for that
is coming soon.

Following the new [Folktale release strategy](http://robotlolita.me/2017/07/15/folktale-2-and-beyond.html#release-strategy), this is
being released in the experimental (`@next`) channel first, so if you want to try it out
you need:

    $ npm install folktale@next

No problems are expected to happen as the changes were modest, but there may be edge cases
with backwards compatibility of `nullableToResult` and `Result.fromNullable`. If no issues
are found during this month, 2.1 will be released in the stable channel in the beginning of
February.


## Experimental TypeScript support

The last few months were spent on studying and getting TypeScript to work well with Folktale.
[Moving to a typed language has been considered for a while](https://github.com/origamitower/folktale/issues/115), and the new versions of TypeScript do
make this a bit more reasonable. The plan is to have Folktale rewritten in TypeScript, and
the documentation revised and improved for this by June of this year.

There are some current limitations with TypeScript that continue to make giving proper
to existing (and future interesting) Folktale functionality difficult:

  - There's no support for Higher-Kinded Polymorphism. This can be somewhat alleviated with
    the fact that TypeScript now supports `this` types, so the overloading and dynamic 
    dispatch on objects solves a lot of things where HKP would be necessary.

    While this is a good start, a submodule like `fantasy-land` can't be given a type that
    preserves input information, so it would require either any types, or casts. The
    [encoding approach](http://ocamllabs.io/higher/lightweight-higher-kinded-polymorphism.pdf)
    to support higher-kinds, as used by [Giulio Canti](https://github.com/gcanti/fp-ts) doesn't
    work with types that are not aware of this encoding, so they're not usable here either.

  - Some features, like the ADT module, are pretty much untypeable. A restricted form of it may
    work with TypeScript's limited type-level operations, but we'll see...

  - TypeScript's handling of function arguments means that it's not possible to support overloading
    existing functions like `waitAll` or `nodebackToTask`. Because of this the TypeScript version
    of Folktale will move back into fixed-arity land. This means you'll have to use `waitAll2(a, b)`
    instead of `waitAll([a, b])` and such.

An initial, experimental release of Folktale with TypeScript support is available in the
`alpha` channel. You can install it with:

    $ npm install folktale@alpha

This will get you `folktale@3.0.0-alpha5`, which includes type definitions for most functionality,
except the `adt` and `fantasy-land` modules.


## The road to 3.0

So, 3.x will be primarily about TypeScript support, but here's what's also planned:

  - Move all the codebase to TypeScript. This means that the type definitions won't get out of sync,
    but it also means that changes will be caught by the type checker. It might be possible to
    automate more updates with a migration tool (TS having a compiler-as-a-library helps), but 
    we'll see about that.

  - Improve the documentation. This will involve separating the conceptual documentation from the
    API documentation, which should make the life of people who are new to functional programming
    a lot easier, it should also make the API documentation searchable, so it works as a quick
    reference.

  - Implement the missing interfaces from Fantasy-Land (including ChainRec).

  - New collection types (List, Vector, Map, Set), concurrent types (CSP channels and push-based streams),
    and numeric types (BigInteger, BigDecimal, BigRational).


## Acknowledgements
  
As always, a huge thank you to everyone who contributed to improving Folktale, by reporting errors, sending feedback, talking about it, sending patches, etc.

This release wouldn't be possible without the contributions of [@diasbruno](https://github.com/diasbruno), [@gvillalta99](https://github.com/gvillalta99), [@MichaelQQ](https://github.com/MichaelQQ), [@stabbylambda](https://github.com/stabbylambda), [@floriansimon1](https://github.com/floriansimon1), and [@scotttrinh](https://github.com/scotttrinh). Really, thank you :>