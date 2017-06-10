---
title: Coding style
prev_doc: v2.0.0/contributing/git-guidelines
next_doc: v2.0.0/contributing/organisation
---

> **TODO**
> This section is a stub and needs to be improved.
{:.warning}

The ESLint rules will catch most of the style issues, so you might just want to
run `make lint` on your code. That said, there are a few idioms that aren't
captured by ESLint rules:

  - Prefer `const` for declaring names wherever possible. When a name or the
    value it refers to is mutated in the scope, use `let` instead. In this
    sense, we use `const` to indicate an immutable binding *and value*, and
    `let` for everything else.

  - Prefer arrow functions whenever possible. Regular JavaScript functions have
    many unnecessary properties for functional programming in general, such as
    `this`, `super` and `.prototype`. So, if you're not writing a method, where
    you'll want `this`, it should be an arrow function.

  - Use Lisp/Haskell-alignment for conditionals when using ternaries. For
    example:

    ```js
    return argCount < arity   ?  curried(allArgs)
    :      argCount === arity ?  fn(...allArgs)
    :      /* otherwise */       unrollInvoke(fn, arity, allArgs);
    ```

    The comment for the last `else` case is not optional, but can be shortened
    to `/* else */` for shorter conditions.