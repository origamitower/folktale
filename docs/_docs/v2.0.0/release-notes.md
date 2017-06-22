---
title: Release notes
prev_doc: v2.0.0
next_doc: v2.0.0/download
---

Folktale v2.0.0 is the result of more than one year of work in constructing and documenting a coherent basis for functional programming in JavaScript. There's a lot left to be done, but this release is an important step in that direction.

This document describes the most noteworthy changes, see the [full changelog]({% link _docs/v2.0.0/changelog.md %}) for all the changes.


## Contents
{:.no_toc}

* TOC
{:toc}


## Highlights

  - [Moving away from currying](#moving-away-from-currying)
    — this release prefers leveraging native JavaScript constructs instead of
    currying, which does not compose well with most JavaScript (variadic) APIs.

  - [Simplified Union types](#simplified-union-types)
    — the new `adt/union` module allows constructing union types in an easy way.

  - [A more robust Task API](#a-more-robust-task-api)
    — the new Task API includes resource handling at the core of its model, and
    tries to mitigate the possibility of race conditions as much as possible.


### Moving away from currying

Folktale 1 relied heavily on currying. [This caused problems when interacting with native JavaScript functions](https://github.com/origamitower/folktale/issues/38). The new library aims to interact better with JavaScript, so native JavaScript constructs are preferred.

Some functions in the new Folktale library are still curried by default. `compose` is a good example. It takes two functions, and returns a new one that takes an argument. The major difference is that there's no automatic unrolling happening.

{% highlight js %}
// Folktale 1.x
const compose = curry(3, (f, g, x) => ...);

compose(f, g, x, y) === compose(f)(g)(x)(y);
compose(f, g, x)    === compose(f)(g)(x);
compose(f, g)(x)    === compose(f)(g)(x);
compose(f)(g)(x)    === compose(f)(g)(x);


// Folktale 2.x+
const compose = (f, g) => (x) => ...;

compose(f, g, x, y) === compose(f, g);
compose(f, g, x)    === compose(f, g);
compose(f, g)(x)    === compose(f, g)(x);
compose(f)(g)(x)    === compose(f)(g)(x); // an error
{% endhighlight %}


More details on currying can be seen in the [`curry() documentation`](/api/v2.0.0/en/folktale.core.lambda.curry.curry.html).


### Simplified Union types

JavaScript does not have native support for tagged unions. This is one of the core features of functional programming. Unions help programmers model possibilities, and often help defining recursive procedures.

Folktale 2 helps with this by providing a new [`union`](/api/v2.0.0/en/folktale.adt.union.html) module. This module allows creating union types by listing the possibilities and their fields.

{% highlight js %}
const { union } = require('folktale/adt/union');

const List = union('List', {
  Empty(){ },

  Cons(value, rest) {
    return { value, rest };
  }
});
{% endhighlight %}


The union module also provides default features for these data structures. The derivation feature allows users to share extensions to these defaults. More details on this module can be found in the [union documentation](/api/v2.0.0/en/folktale.adt.union.html).


### A more robust Task API

Folktale 1 introduced a concept of Tasks to help with asynchronous computations. However, the API made composition difficult, and increased the likelihood of hitting race conditions and other edge cases.

Folktale 2 includes a full redesign of the Task API, focused on ease of use, compositionality and robustness. Thew new Task model now fully supports asynchronous resource lifecycle handling, concurrent composition, and task cancellation.

The [Task documentation](/api/v2.0.0/en/folktale.concurrency.html) describes this in details.



## Acknowledgements

A huge thank you to everyone who contributed to improving Folktale, by reporting errors, sending feedback, talking about it, sending patches, etc.

A special thank you to:

  - [@rpearce](https://github.com/rpearce): Converting nodebacks to Tasks (PR [#116](https://github.com/origamitower/folktale/pull/116))
  - [@boris-marinov](https://github.com/boris-marinov):
    - Porting [Either/Result](https://github.com/origamitower/folktale/pull/6) and [Validation](https://github.com/origamitower/folktale/pull/22);
    - Writing most of the [data conversions](https://github.com/origamitower/folktale/pull/24) and [generic fantasy-land functions](https://github.com/origamitower/folktale/pull/37);
    - Writing the [Equality](https://github.com/origamitower/folktale/pull/10), [Serialization](https://github.com/origamitower/folktale/pull/15), and [DebugRepresentation](https://github.com/origamitower/folktale/pull/12) derivations;
    - Helping with all the test infrastructure and providing valuable feedback on API design, which is greatly appreciated even if it can't be mapped to a specific pull request :)
  - [@amilajack](https://github.com/amilajack): Updating dependencies (PR [#33](https://github.com/origamitower/folktale/pull/33))
  - [@sotojuan](https://github.com/sotojuan): Making our npm package less bloated (PR [#34](https://github.com/origamitower/folktale/pull/34))
  - [@syaiful6](https://github.com/syaiful6): Removing a duplicated Setoid derivation (PR [#57](https://github.com/origamitower/folktale/pull/57))
  - [@degroote22](https://github.com/degroote22): Fixing some typos in the docs (PR [#59](https://github.com/origamitower/folktale/pull/59))
  - [@RossJHagan](https://github.com/RossJHagan): Fixing some formatting issues with the curry docs (PR [#72](https://github.com/origamitower/folktale/pull/72))
  - [@justin-calleja](https://github.com/justin-calleja): Documentation improvements (PRs [#94](https://github.com/origamitower/folktale/pull/94), [#103](https://github.com/origamitower/folktale/pull/103), and [#107](https://github.com/origamitower/folktale/pull/107))
  - [@diasbruno](https://github.com/diasbruno): Implementing Semigroup and Monoid for Maybe (PR [#125](https://github.com/origamitower/folktale/pull/125))