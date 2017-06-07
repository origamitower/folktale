@guide: Contributing code
category: 3. Contributing
authors:
  - "@robotlolita"
---

Read this if you want to fix a bug in Folktale or implement a new feature.

* * *

Before making your changes, you'll have to [set up a development environment](guides.setting-up-a-development-environment.html). You might also be interested in understanding [how the repository is organised](guides.navigating-the-folktale-repository.html) and [how Git commits are annotated](guides.git-commit-guidelines.html).


Note that Folktale uses a common workflow where new development happens in topic branches,
and then a Pull Request is made in order to merge those branches back into the
master branch. GitHub has a
[nice description of this workflow](https://guides.github.com/introduction/flow/).


## Copyright, Licence, and Contributors

All JavaScript files in the project should start with the following preamble:

```js
//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------
```

Note, again, that Folktale is licensed under MIT, and **by contributing patches,
you agree to release your contribution under the MIT licence.**

If you're making or have made a contribution to the project, please add yourself
to the `CONTRIBUTORS` file if you haven't done so yet.


## Implementing your changes

Whether you're fixing a bug or adding a new feature, the process is roughly the same. You'll want to create a new branch for your feature. This allows you to
work on more than one feature at a time, if necessary. Remember that working on
a patch for a software project involves a lot of communication, and you might
need to review your code a few times.

Roughly the process follows these steps:

  1. You make your changes, either by fixing existing code or adding new features, and commit them to the repository.
  2. If adding a new feature, make sure to [write test cases](guides.improving-folktale-s-tests.html) and [add a minimal documentation](guides.improving-folktale-s-documentation.html).
  3. Run `make test-all` to ensure that all tests pass. This will run your tests on both Node and a PhantomJS (WebKit) instance. Compiling everything may take a while…
  4. Run `make lint` to ensure that your code conforms with the [coding style](guides.coding-style.html) used by Folktale.
  5. Push your changes to your repository.
  6. [Create a Pull Request](https://help.github.com/articles/creating-a-pull-request/) from your branch in your repo, to Folktale's `master` branch.
  7. This starts a code review and discussion. You might be asked to make some changes to your code (at which point you'd just follow the steps 1~5 above).
  8. We accept your Pull Request and merge it into the master branch, or reject it with a justification.


## Documenting new features

Folktale uses Meta:Magical for attaching documentation to objects, which can be
queried at runtime. There's a
[comprehensive text on documenting objects with Meta:Magical](https://github.com/origamitower/conventions/blob/master/documentation/how-do-i-document-my-code.md),
so this section will only focus on the basics to get you started.

In the source code, functions, methods, modules, and objects should be annotated with
[Meta:Magical comments](https://github.com/origamitower/metamagical/tree/master/packages/babel-plugin-metamagical-comments).
These comments should describe who authored that functionality, what is its stability, and its type.
When relevant, functions should also describe their complexity in [Big O notation](https://en.wikipedia.org/wiki/Big_O_notation).

Here's an example of documentation for the `core/lambda/compose` function:

```js
/*~
 * stability: stable
 * authors:
 *   - "@robotlolita"
 * type: |
 *   forall a, b, c: ((b) => c, (a) => b) => (a) => c
 */
const compose = (f, g) => (value) => f(g(value))
```

A documentation comment is a block comment whose first line contain only the `~`
character. Subsequent lines use `*` as an indentation marker, meaning that all
content before that, and at most one space after that is ignored.

Once an entity has been marked to be documented, you can follow the [documentation guide](guides.improving-folktale-s-documentation.html) to write documentation for it.

