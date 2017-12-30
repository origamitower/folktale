---
title: Git commit guidelines
prev_doc: v2.1.0/contributing/tests
next_doc: v2.1.0/contributing/coding-style
---

Folktale uses [.gitlabels](https://github.com/ELLIOTTCABLE/.gitlabels) to
tag commits so humans can better understand the scope of changes, and tools
can help visualising changes.

## Contents
{:.no_toc}

* TOC
{:toc}


## Commit format

Commits often follow this format:

```
(<tags>) <summary>

<body>

<footer>
```

Where:

  - `tags`: The `.gitlabels` tags defining the scope of changes. See the `.gitlabels` file for documentation;
  - `summary`: A very short description of the change.
  - `body`: A detailed description of the change.
  - `footer`: contains information about issue references and breaking changes.

All text should be formatted using Markdown, and use the active, present
tense. It's "changes", rather than "change" or "changed".

For example, a commit that adds tests to the `folktale/core/lambda` module would
look like:

```
(test) Adds tests for compose

`compose` was the only function in the module that didn't have tests.
This provides a few example based tests, and property-based tests for
common mathematical laws expected of function composition, such as
associativity.

Fixes #12
```


## Referencing issues

Issues may be referenced through the body of the commit, where relevant, by
providing `(see #N)`, where `N` is the number of the issue. For example:

```
This is a first step in providing better documentation tools (see #91),
but does not implement type searching and type summaries.
```

Issues should be closed when the commit fully fixes the problem in that
issue. This is done by listing these issues in the footer, using
[GitHub's issue keywords](https://help.github.com/articles/closing-issues-via-commit-messages/). For example:

```
Fixes #12, fixes #43, and fixes #46
```


## Breaking changes

All breaking changes should be detailed in the footer of the commit message. It
should contain `BREAKING CHANGE:` followed by a short summary of what was
broken, and a detailed justification of why it was broken, along with a
migration path from the old feature to the new one. For example:

```
BREAKING CHANGE: makes `data` return an object with constructors,
instead of the old interface.

This makes creating new algebraic data structures a simpler task,
and aligns better with the aim of making Folktale a welcoming
library to people new to functional programming.

Where one used to write:

    const List = data({
      Nil: [],
      Cons: ['value', 'rest']
    });

    const Nil = () => new List.Nil.constructor({});
    const Cons = (value, rest) => new List.Cons.constructor({ value, rest })

One would write:

    const List = data({
      Nil: [],
      Cons: ['value', 'rest']
    });

    const { Nil, Cons } = List;
```
