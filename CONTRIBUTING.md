# Contributor Guide

Hello there!

There are many ways in which you can contribute to Folktale, and this document
provides guidelines for the social and technical aspects that come into play for
most contributions to the project.

Do note that people are expected to follow Origami Tower's
[Code of Conduct](https://github.com/origamitower/folktale/blob/master/CODE_OF_CONDUCT.md).
This code of conduct applies to all interactions in the project, be them when
discussing issues on GitHub, asking or providing support in the Gitter channel,
or any other social interaction involving Folktale.

Harassment of any form will not be tolerated. If you are being harassed, please
[contact us immediately](https://github.com/origamitower/folktale/blob/master/CODE_OF_CONDUCT.md#enforcement)
so that we can support you.


## Table of Contents

  - [How can I contribute to Folktale?](#how-can-i-contribute-to-folktale)
  - [Reporting bugs](#reporting-bugs)
  - [Requesting features](#requesting-features)
  - [Contributing code](#contributing-code)
      - [Copyright, Licence, and Contributors](#copyright-licence-and-contributors)
      - [Pre-requisites](#pre-requisites)
          - [Git](#git)
          - [Node](#node)
          - [Make](#make)
              - [Debian/Ubuntu (Linux)](#debianubuntu-linux)
              - [Arch (Linux)](#arch-linux)
              - [Fedora / Enterprise Linux](#fedora--enterprise-linux)
              - [Windows](#windows)
      - [Working with Git and GitHub](#working-with-git-and-github)
      - [Git commit guidelines](#git-commit-guidelines)
          - [Commit types](#commit-types)
          - [Referencing issues](#referencing-issues)
          - [Breaking changes](#breaking-changes)
      - [The design principles behind Folktale](#the-design-principles-behind-folktale)
      - [How is Folktale organised?](#how-is-folktale-organised)
          - [Source hierarchy](#source-hierarchy)
          - [Test hierarchy](#test-hierarchy)
          - [Build artefacts](#build-artefacts)
      - [Development tasks and tooling](#development-tasks-and-tooling)
      - [Writing documentation](#writing-documentation)
      - [Writing tests](#writing-tests)
      - [Coding style](#coding-style)


## How can I contribute to Folktale?

Here are some ways in which you can contribute to the Folktale community:

  - Join the [Gitter Channel][gitter] and ask and/or answer questions. Folktale
    aims to be usable by people new to FP, so by asking questions and sharing
    your troubles with the library, you're helping us get closer to that goal.

  - Talk about Folktale. By bloggging, writing tutorials, or giving talks in
    your local JS community. A bigger and healthy community helps by really
    putting the libraries to test.

  - [Report bugs](#reporting-bugs) in our [GitHub issue tracker][issues], or
    [request new features](#requesting-features).

  - [Submit patches](#contributing-code) for new features, or to fix existing
    bugs.

  - [Improve existing documentation](#writing-documentation).


## Reporting bugs

Sometimes things don't work as well as they should, or we can't make them work
the way we want, and we get frustrated by that. Both of those are situations
were we encourage you to open an issue in the [GitHub issue tracker][issues] so
we can help you.

Opening a ticket is primarily a way of starting a discussion on a particular
problem. In some cases (for example, if you're not sure what the behaviour of
something should be), you might consider sticking around the
[Gitter channel][gitter] and talking to people about it before opening an issue,
but don't feel like you *need* to. Both the Gitter channel and the issue tracker
are places for discussion.

Once you've decided to open an issue, please follow these guidelines to ensure
that the conversation goes as smoothly as possible, so we can help you faster:

  - Search the issue tracker to see if someone has already reported the problem
    before. This helps keep the conversation in just one place, where possible,
    and benefits more people.

  - Try to create a minimal test cases that reproduces the problem. These make
    it easier for you and for us to understand what's really happening, and
    what's causing the problem.

  - Try to provide as much information about the problem as possible, and be
    prepared to follow up if we ask you for clarifications on certain parts of
    it in order to understand the problem better.

If you're not sure how to format your bug report, here's a template you can follow:

```md
(A short description of the problem)

### Steps to reproduce

(Provide, where possible, a clear set of instructions to replicate the
problem. If you can, include a minimal test case that reproduces the problem and
that we can run)

#### Expected behaviour

(What you expected to happen)

#### Observed behaviour

(What happened instead)

### Environment

(Describe the environment where the problem happens. This usually includes:)

  - OS
  - JavaScript VM
  - Folktale version

### Additional information

(Anything else you feel relevant to the issue)
 ```

Here's an example that uses the template above:

```md
`constant` throws `"0 is not a function"` error when used with `Array.map`.

### Steps to reproduce

    const constant = require('folktale/core/lambda/constant');
    [1, 2, 3].map(constant(0));
    // => Uncaught TypeError: 0 is not a function

#### Expected behaviour

I expected the code above to result in the array `[0, 0, 0]`.

#### Observed behaviour

The code throws a type error saying `0 is not a function`.

### Environment

  - Folktale 2.0.0
  - Node 4.2.4
```

Of course, you're not required to follow this exact template. It's there for you
to use if you want to, but it doesn't fit all possible tickets. If you're
reporting an issue with the documentation, for example, your ticket should focus
on what you feel the problem with the documentation is. Maybe the phrasing is
hard to follow, maybe there are grammatical mistakes, maybe it assumes knowledge
of some concept that's not explained anywhere else, maybe it's outdated.

Below is an example of how one could go about reporting an issue with the
documentation:

```md
The documentation for `Data.Maybe` assumes familiarity with concepts such as
`Monad` and `Functor` that are not explained anywhere. Maybe it's immediately
obvious to those people how and when they would choose to use this data
structure, but I still don't know why I would use it after reading the
documentation.

I should note that I am a beginner in functional programming, and I think the
documentation right now could be more clear on its motivations. More concrete
examples would help.
```


## Requesting features

Folktale doesn't do everything, so more often than not you'll find something
that you wish Folktale supported but that isn't implemented yet. Maybe the
thought has never crossed our minds. This is a great opportunity to
[tell us about that feature you want][issues].

Before you open an issue in the GitHub tracker, however, it's important to
consider whether the feature you're proposing really belongs in Folktale. Here
are a few guidelines for things that would be a good fit for Folktale:

  - The feature is an **algebraic data structure**, with well-defined
    mathematical **laws** governing its behaviour. Folktale is a functional
    library greatly inspired by Abstract Algebra and Category Theory, and it
    avoids law-less functionality where possible in order to make abstractions
    safer and more composable.

  - The feature is an utility function that covers a recurrent
    pattern. Sometimes the abstractions provided in Folktale are general, but
    still require some boilerplate when doing common things with it. Utility
    functions that avoid this boilerplate by providing the feature out of the
    box are a great fit.

If you're in doubt on whether the feature you have in mind fits Folktale or not,
open an issue anyway, that way we can start a discussion about it. You can also
ask in the [Gitter channel][gitter].

When you open an issue, it's important to describe clearly what the missing
feature is, and why it is important to have this feature. Examples are a great
way to present the feature and show how it would look like when implemented.

If you're not sure about how to format it, you can follow this template:

```md
(A short description of what the functionality is)

    (An example showing how one would use the functionality)

### Why?

(Describe why the functionality is important to have in Folktale)

### Additional resources

(If there are any materials relevant to the suggestion — a paper, a talk on the
subject, etc. you can provide them here)
```

Here's an example of a feature request using this template:

```md
I would like to have a `.concat` method for `Data.Validation`.

    const v1 = Validation.Failure(1);
    const v2 = Validation.Failure("error");
    v1.concat(v2)
    // => Validation.Failure([1, "error"])


### Why?

Validations can already aggregate failures through the applicative instance, but
this requires lifting all failures into a semigroup (like Array), and
constructing a curried function with N arguments to handle the Success case. So,
while one can achieve the same as the example above by using `.ap`, it requires
much more effort.

We often have to aggregate unrelated failures. Some of these failures might not
have been lifted into a semigroup yet. So we'd like a simpler function that only
provides the failure aggregation part.
```


## Contributing code

Because Folktale is a software project, one of the obvious ways of contributing
to it is by writing code, be it by fixing a bug in existing feature,
implementing a new feature, or improving doc annotations. This section will help
you with that.

Before proceeding, note that Folktale is licensed under MIT, and **by
contributing patches, you agree to release your contribution under the MIT
licence.**

Now that we got that out of the way, it's important to be aware of a few things
before you start writing code:

  - You'll be using [Git](https://git-scm.com/) and
    [GitHub](https://github.com/). Folktale uses topic branches in git, and
    handles all contributions through GitHub's pull requests. If you're not
    familiar with Git, please refer to the
    [Pro Git book](https://git-scm.com/book/en/v2), which is a comprehensive
    book on the tool.

  - Folktale uses [GNU Make](https://www.gnu.org/software/make/) as a build
    system, and relies on some *NIX tools. This means that you need `gmake` in
    BSD systems, and you need to configure
    [GnuWin](http://gnuwin32.sourceforge.net/) on Windows.

  - Folktale code is written with a very particular
    [coding style](#coding-style). [ESLint](http://eslint.org/) will help
    enforcing that.

  - Folktale uses
    [Meta:Magical doc-comments][metamagical]
    for documenting code entities.


### Copyright, Licence, and Contributors

All JavaScript files in the project should start with the following preamble:

```js
//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Copyright (C) 2015-2016 Quildreen Motta and CONTRIBUTORS.
// Licensed under the MIT licence.
//
// See LICENCE for licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------
```

Note, again, that Folktale is licensed under MIT, and **by contributing patches,
you agree to release your contribution under the MIT licence.**

If you're making or have made a contribution to the project, please add yourself
to the `CONTRIBUTORS` file if you haven't done so yet.


### Pre-requisites

Configuring a development environment for Folktale is currently a little bit
more complicated than it should in some systems, but this section should help
you achieve that anyway.

#### Git

First of all, you'll have to make sure you have [Git](https://git-scm.com/)
installed. Folktale uses Git repositories, and while while you can use things
like [hg-git](http://hg-git.github.io/) to interact with the repository from
Mercurial, we can't support that.

The Git website has a list of GUI clients for Git, if you're not comfortable
using it from the command line.

#### Node

Next you'll need to install [Node.js](https://nodejs.org/en/). The website
provides binaries for all supported platforms. All newer versions of Node come
with npm as well, which you'll use to pull the dependencies of the project.

Note that Folktale requires at least Node 4.x, so if you have an older version
you'll need to upgrade.

#### Make

Folktale uses Make as its build system, and also relies on some common *NIX
tools, like `find`. Because of this, it might be harder to configure a
development environment for Windows.

Below are instructions to install Make on common systems:

> **TODO**  
> Provide instructions for OS/X and *BSD systems.

##### Debian/Ubuntu (Linux):

    $ apt-get install build-essential

##### Arch (Linux):

    $ pacman -S base-devel

##### Fedora / Enterprise Linux:

    $ yum install "Development Tools"

##### Windows:

 1. Download the latest version of [GnuWin32](https://sourceforge.net/projects/getgnuwin32/files/). This should be something like `GetGnuWin32-*.exe`;
 2. Execute the application you just downloaded. You have to accept the licence to proceed;
 3. Select a folder to extract the components to;
 4. Run `download.bat` from the folder you extracted the components to;
 5. Finally, run `install.bat` from that folder.
        

### Working with Git and GitHub

Folktale uses a common workflow where new development happens in topic branches,
and then a Pull Request is made in order to merge those branches back into the
master branch. GitHub has a
[nice description of this workflow](https://guides.github.com/introduction/flow/).

The first thing you'll want to do is
[forking Folktale](https://guides.github.com/activities/forking/). This means
you get a clone of the entire project that you have rights to change as you
wish. Once you have forked Folktale, you can clone your fork:

```shell
$ git clone https://github.com/YOUR_GITHUB_USERNAME/folktale.git
```

This will create a `folktale` folder containing all of the code in the
project. The first thing you need to do is move in that folder and install all
of the dependencies and development tools that Folktale uses:

```shell
$ cd folktale
$ npm install
```

Finally, you'll want to create a new branch for your feature. This allows you to
work on more than one feature at a time, if necessary. Remember that working on
a patch for a software project involves a lot of communication, and you might
need to review your code a few times.

From here on, development pretty much follows the process below:

 1. Make your changes.
 2. [Write test cases](#writing-tests) for your changes.
 3. Run `make test` to ensure that all tests pass.
 4. Run `make lint` to ensure that your code conforms with the coding guidelines
    used by Folktale.
 5. Push your changes to your repository.
 6. Create a pull request for the feature branch.
 7. We review your code, and may ask you to make some changes.
 8. Finally, we accept or reject the pull request, and merge it into the master
    branch.


### Git commit guidelines

Folktale uses a convention similar to
[Angular.js](https://github.com/angular/angular.js/blob/master/CONTRIBUTING.md#-git-commit-guidelines)
for Git commits. These aim to make it easier to follow the history of the
project, and for tools to extract information from them.

The following commit format is used:

```
<type>(<category?>): <summary>

<body>

<footer>
```

Where:

  - `type`: The kind of change this commit introduces;
  - `category`: The category this commit applies to, like `Core.Lambda`, if it refers to only one of them.
  - `summary`: A very short description of the change.
  - `body`: A detailed description of the change.
  - `footer`: contains information about issue references and breaking changes.

All text should be formatted using Markdown, and use the active, present
tense. It's "changes", rather than "change" or "changed".

For example, a commit that adds tests to the `folktale/core/lambda` module would
look like:

```
test(Core.Lambda): Adds tests for compose

`compose` was the only function in the module that didn't have tests.
This provides a few example based tests, and property-based tests for
common mathematical laws expected of function composition, such as
associativity.

Fixes #12
```

A commit that doesn't have a particular scope would look like:

```
docs: Improves coding style section in contributor guide

Expands the current rules with examples.
```


#### Commit types

The following commit types are accepted:

  - **feat**: A new feature;
  - **fix**: A bug fix;
  - **docs**: Introduces or improves documentation;
  - **style**: Purely stylistic changes, such as formatting, indentation, getting rid of linter warnings, etc.
  - **refactor**: Refactoring existing features;
  - **perf**: Performance optimisations;
  - **test**: Introduces or improves test cases;
  - **other**: Every other maintenance aspect that isn't better captured by the types above.


#### Referencing issues

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


#### Breaking changes

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


### The design principles behind Folktale

The design of the Folktale library is guided by the following principles:

  - **Favour a heavier use of arrow functions over currying**  
    — Curried functions can be composed in several ways. And this is a good
    thing, because it means it's easier to create new functionality by combining
    existing ones. However, in an untyped language, you have no ways of
    enforcing a correct composition of functions, so currying in JS tends to
    lead to silent or late errors. Coupled with JavaScript's heavy use of
    variadic functions, and the VM's unhelpful error reporting, these have the
    potential for being very frustrating, especially for people new to FP.

    ES2015 lessens a bit the burden of being more explicit with your
    composition, since arrow functions have less visual overhead, and can
    enforce some compositional constraints syntactically. They also side-step
    the problems with JavaScript's variadic functions to an extent.

  - **Provide separate free-method versions of functions**  
    — JavaScript's syntax is limited, but some of the proposed additions to it
    lead to programs that are easier to read. One of them is the
    [This-Binding syntax](https://github.com/zenparsing/es-function-bind), which
    allows unsing functions in infix position:

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

  - **Where possible, as long as laws aren't broken, reuse the language's native methods**  
    — This makes it easier to combine Folktale with existing projects and
    libraries, as they'd have similar expectations.

  - **Monolithic package over several micro-libraries**  
    — There are plenty of advantages of micro-libraries. They are more modular,
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

  - **Better support for interactive (REPL) development**  
    — One of the long-term goals with Folktale is to have a really good support
    for interactive development in the REPL. The first step for that is to be
    able to view documentation directly from the REPL, which is being done by
    annotating objects with the
    [Meta:Magical](https://github.com/origamitower/metamagical) library.

    As newer features get added to Meta:Magical, like searching functions by
    approximate type signature, Folktale and its users will benefit from them
    without having to do anything.

  - **Logically grouped, minimal modules**  
    — Each module should be entirely self-contained, and only provide the
    absolute minimum necessary for that particular functionality. Most of the
    time this will mean `one function = one module`, but not always. See the
    `folktale/core/adt` module, and the
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

  - **Modules are grouped in an hierarchy of categories**  
    — This is mostly to make using the libraries easier given the previous
    point. Modules that are higher in the hierarchy should re-export all
    features below it. This allows people to require a bag of things, like
    `require('folktale/data/either')`, or a very specific functionality, when
    they are concerned about the resulting size of the application (if they are
    deploying to a Browser, for example), like
    `require('folktale/data/either/fromNullable')`.


### How is Folktale organised?

The Folktale repository is organised as follows:

  - `/folktale` — Root of the project.

    Configuration files:

      - `.babelrc`
         — Configurations for the Babel compiler.
      - `.eslintrc.json`
         — Linting rules for ESLint.
      - `package.json`
        — Meta-data for the npm package (version, description, dependencies, etc).
      - `.travis.yml`
        — Configuration for running automated tests in the Travis CI server.
      - `.eslintignore`
        — A set of glob patterns for files that shouldn't be linted.
      - `.npmignore`
        — A set of glob patterns for files that shouldn't be included in npm's packages.
      - `.gitignore`
        — A set of glob patterns for files that shouldn't be committed to the repository.


    Documentation files:

      - `CODE_OF_CONDUCT.md`
        — Social rules that all people in the community are expected to follow.
      - `CONTRIBUTING.md`
        — This file. A guide for people who want to contribute to Folktale.
      - `README.md`
        — Tells people what Folktale is for, how to install it, how to begin using it, where to get support, and other important information.
      - `LICENCE`
        — The licence under which Folktale is released (MIT).
      - `CONTRIBUTORS`
        — A list of all people who have contributed to Folktale.
      - `CHANGELOG.md`
        — A chronological list of changes made to the project, grouped by versions.


    Developer tooling:

      - `Makefile`
        — Common development tasks.


    Source files:

      - `src/`
        — The implementation of Folktale libraries, in JavaScript.
      - `test/`
        — Unit tests for Folktale, using Mocha.


#### Source hierarchy

The source tree is organised as a hierarchy of objects. At each level you have
an `index.js` file that re-exports functions and objects of that level. This
allows people to import bags of features, or a particular feature separately.

  - `core` — Provides the baseline for all features in Folktale, by filling the
    gaps of the functionality needed for the standard data structures. The
    purpose of `core` is to just provide enough functionality to make other
    categories possible. The focus is on better data structures and composing
    data structures.

      - `lambda` — Common combinators for functions.
      - `adt` — Support for algebraic data types.
      - `object` — Support working with objects-as-records/dictionaries.
      - `string` — Common operations on strings.
      - `comparison` — Comparisons between built-in JS values.
      - `equality` — Equality between built-in JS values.
      - `inspecting` — Textual representations of built-in JS values.
      - `contracts` — First and higher-order run-time contracts.
      - `iterables` — Lazy sequences using JS's iterable protocol.

  - `data` — Provides implementations of data structures that are common in
    functional programming.

      - `maybe` — A structure for modelling the presence or absence of a value.
      - `either` — A structure for modelling a tagged disjunction of two values.
      - `validation` — A structure similar to Either, but designed for validations and supporting error aggregation.
      - `task` — A structure for modelling a potentially asynchronous action.


#### Test hierarchy

Folktale uses Mocha for testing, which expects tests to go in the `test/`
folder. Right now all test files are placed directly in that folder.

Test files are named `<category>.<subcategory>.es6` (e.g.: `core.lambda.es6`),
and provide tests for all functionality defined in that category. When compiled,
this generates `<category>.<subcategory>.js` files in the same folder.


#### Build artefacts

Most of the source code is compiled through [Babel](https://babeljs.io/) before
running. This generates what we call "build artefacts" in the project's working
directory. While these files are ignored by Git (with `.gitignore` rules), they
might still show up in your text editor and be somewhat confusing.

When source code is compiled (from `src/`), the same structure you see under
`src/` is replicated under the root of the project's working directory. So, for
example, after compiling you'd have an `index.js` at the root, then an
`core/lambda/identity.js` starting at the root, and so on, and so forth.

When test cases are compiled (from `test/`), they generate files with the same
name, but using the `.js` extension instead of the `.es6` extension used by the
source.

You can always remove these files by running `make clean` from the root of the
project.


### Development tasks and tooling

As mentioned previously, Folktale uses GNU Make for development tooling. From
there you can compile the source code, run tests, perform cleanup routines, or
check your source code for style errors.

Running `make` or `make help` will show you all of the available development
tasks.

Running `make compile` will compile the source code using Babel. After this you
can import the objects in the REPL and interact with them.

Running `make test` will compile the project and run all of the tests. This
takes a while to start compiling, so you can run `make test-watch` instead if
you want to re-run the tests after every modification you make to the tests.

Running `make lint` will check all of the source code for style
inconsistencies. The coding style used by Folktale is described later in this
document.

Finally, running `make clean` will remove any compiled files from your working
directory, but will keep all other files intact. You can always run `make
compile` again to re-build the project.


### Writing documentation

Folktale uses Meta:Magical for attaching documentation to objects, which can be
queried at runtime. There's a
[comprehensive text on documenting objects with Meta:Magical](https://github.com/origamitower/conventions/blob/master/documentation/how-do-i-document-my-code.md),
so this section will only focus on the basics to get you started.

All functions, objects, and methods in Folktale should be properly annotated
with
[Meta:Magical comments](https://github.com/origamitower/metamagical/blob/master/babel-plugin/README.md). These
comments should at the very least describe what the functionality is, and
expectations such as signature and types.

Here's an example of documentation for the `core/lambda/compose` function:

```js
/*~
 * Composes two functions.
 *
 * The compose operation allows function composition. For example, if
 * you have two functions, `inc` and `double`, you can compose them
 * such that you get a new function which has the characteristics of
 * both.
 *
 *     const inc    = (x) => x + 1
 *     const double = (x) => x * 2
 *     const incDouble = compose(double, inc)
 *
 *     incDouble(3)
 *     // => double(inc(3))
 *     // => 8
 *
 * > **NOTE**  
 * > Composition is done from right to left, rather than left to right.
 *
 * ---
 * signature: compose(f, g)(value)
 * type: (β -> γ, α -> β) -> α -> γ
 * category: Combinators
 * tags: ["Lambda Calculus"]
 * stability: stable
 * platforms: ["ECMAScript"]
 * licence: MIT
 */
const compose = (f, g) => (value) => f(g(value))
```

A documentation comment is a block comment whose first line contain only the `~`
character. Subsequent lines use `*` as an indentation marker, meaning that all
content before that, and at most one space after that is ignored.

The comment is broken down in two parts by a line containing at most 3 dash
(`-`) characters, `---` in the example above. The first part of the comment is
the documentation text. This should explain what the functionality is, and how
you would use it. The second part of the comment is a
[YAML](http://www.yaml.org/spec/1.2/spec.html) document with meta-data such as
`signature`, `type`, `stability`, etc. The
[documenting with Meta:Magical](https://github.com/origamitower/conventions/blob/master/documentation/how-do-i-document-my-code.md#metadata-with-metamagical)
text documents all of the available meta-data fields, what they are for, and
which values they accept.


### Writing tests

Folktale uses [Mocha](https://mochajs.org/) and
[JSVerify](https://github.com/jsverify/jsverify) for tests. Property-based tests
are preferable, but sometimes example-based tests make more sense, Amanda
Laucher and Paul Snively have a very good
[talk about when to use Property-based tests and when to use example-based tests](https://www.infoq.com/presentations/Types-Tests),
which you can use as a basis to make this decision.

Tests go in the proper `<category>.<subcategory>.es6` file in the `test/` folder
for the category of the functionality you're writing tests for. For example,
tests for the `compose` function of `core/lambda` would go in the
`core.lambda.es6` file. If the file already exists, you only need to add a new
test definition to it. Otherwise, you'll need to create a new file.

Here's an example of how one would write tests for the `compose` function, in a
`core.lambda.es6` file:

```js
// Import the jsverify library. This will be used to define the tests
const { property } = require('jsverify');

// Import the category we're testing (core.lambda). By convention, the
// variable `_` is used to hold this object, since it has less visual
// clutter.
const _ = require('../').core.lambda;

// Define the test case. Mocha adds the `describe` function to define
// a test suite. You should create a suite for the category, and a
// suite for the function being tested inside of that:
describe('Core.Lambda', _ => {
  describe('compose', _ => {
    // Finally, we define our test, using JSVerify's `property`
    property('Associativity', 'nat', (a) => {
      const f = (x) => x - 1;
      const g = (x) => x * 2;
      const h = (x) => x / 3;

      return _.compose(f, _.compose(g, h))(a)
      ===    _.compose(_.compose(f, g), h)(a)
    })
  })
})
```

With property based tests, JSVerify generates random data of the type described
in the property and feeds it into the function. When an error occurs, it tries
to find the smallest value that still reproduces the error and reports that to
you, so you can try to debug it.

Sometimes it makes more sense to write an example-based test than a
property-based one. For these, instead of the `property` function from JSVerify,
test cases are defined with the `it` function from Mocha, and assertions use
Node's native `assert` module:

```js
const assert = require('assert');
const _ = require('../').core.lambda;

describe('Core.Lambda', _ => {
  describe('compose', _ => {
    it('Invokes functions from right to left', _ => {
      const f = (x) => x - 1;
      const g = (x) => x * 2;

      assert.equal(_.compose(f, g)(2), 3);
    })
  })
})
```

To run tests, you can use `make test` from the root of the project. While
working on a test, it might be better to run `make test-watch`, which will watch
for changes on the test files, and recompile/re-run them when they happen.


### Coding style

> **TODO**  
> This section is a stub and needs to be improved.

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


[metamagical]: https://github.com/origamitower/conventions/blob/master/documentation/how-do-i-document-my-code.md
[gitter]: https://gitter.im/folktale/discussion
[issues]: https://github.com/origamitower/folktale/issues
