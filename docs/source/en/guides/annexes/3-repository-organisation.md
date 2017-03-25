@guide: Navigating the Folktale repository
category: 4. Annexes
authors:
  - "@robotlolita"
---

What all the folders and files in the Folktale repository are for.

* * *

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
      - `docs/source`
        — Special markdown/YAML documentation files, separated by language.



    Developer tooling:

      - `Makefile`
        — Common development tasks.
      - `tools`
        — Custom tooling written for Folktale.
      - `metamagical/`
        — A set of tools to support documentation and tests.


    Source files:

      - `src/`
        — The implementation of Folktale libraries, in JavaScript.
      - `test/`
        — Unit tests for Folktale, using Mocha.


    Auto-generated files:

      - `index.js`, `core/`, `data/`, `helpers`
        — Generated from the source code in `src/` through `make compile`. These are the library's code that gets loaded by requiring the package.

      - `annotated/`
        — Generated from the source code in `src/` through `make compile-annotated`. Contains special annotations for the documentation tooling.

      - `dist/`
        — Generated with `make bundle`. Distribution files for browser environments, compiled with Browserify.

      - `docs/build/`
        — Generated from documentation files in `docs/source/` through `make compile-documentation`. Used to generate documentation and test examples in the documentation.

      - `docs/api/`
        — Static HTML documentation, generated through `make documentation`.

      - `node_modules/`
        — Dependencies installed by npm.

      - `test/helpers/` and `test/specs/`
        — Generated from their `*-src/` folder through `make compile-test`. These are the test files that get actually ran by the testing tool.

      - `test/browser/browser-tests.js`
        — Generated from `test.js` through `make compile-test`. A bundle of the entire library and test files that can be loaded in a browser.

      - `releases/`
        — Generated through `publish`. Contains distribution packages.


## Source hierarchy

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

      - `conversions` — Functions to convert between data types.
      - `maybe` — A structure for modelling the presence or absence of a value.
      - `result` — A structure for modelling a tagged disjunction of two values.
      - `validation` — A structure similar to Result, but designed for validations and supporting error aggregation.
      - `task` — A structure for modelling a potentially asynchronous action.
      - `future` — A structure for modelling an eventual value. Used by `task`.


## Test hierarchy

Folktale uses Mocha for testing, which expects tests to go in the `test/specs-src/`
folder. Right now all test files are placed directly in that folder.

Test files are named `<category>.<subcategory>.js` (e.g.: `core.lambda.es6`),
and provide tests for all functionality defined in that category. When compiled,
this generates `<category>.<subcategory>.js` files in the `test/specs/` folder.


## Build artefacts

Most of the source code is compiled through [Babel](https://babeljs.io/) before
running. This generates what we call "build artefacts" in the project's working
directory. While these files are ignored by Git (with `.gitignore` rules), they
might still show up in your text editor and be somewhat confusing.

When source code is compiled (from `src/`), the same structure you see under
`src/` is replicated under the root of the project's working directory. So, for
example, after compiling you'd have an `index.js` at the root, then an
`core/lambda/identity.js` starting at the root, and so on, and so forth.

When test cases are compiled (from `test/specs-src/` and `test/helpers-src/`), they
generate files with the same name in the `test/specs/` (and `test/helpers/`) folder.

Documentation files, in `docs/source/` are compiled to regular JavaScript files
that add special annotations to runtime objects. When compiled, the structure in
`docs/source/` is replicated in `docs/build/`.

You can always remove these files by running `make clean` from the root of the
project.
