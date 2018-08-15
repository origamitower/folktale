---
title: "How is Folktale organised?"
prev_doc: v2.1.0/contributing/coding-style
---

This page describes how several parts of the Folktale project are organised.


## Contents
{:.no_toc}

* TOC
{:toc}


## Issue tracker

Ideas and bugs live in the [Github Issue tracker](https://github.com/origamitower/folktale/issues), and can be
visualised as a Kanban board in [Waffle.io](https://waffle.io/origamitower/folktale).
If you're not sure where to start, there's a selection of [good first
issues](https://waffle.io/origamitower/folktale?label=e:Good%20First%20Issue)
which you may want to try.

All tasks are categorised in terms of the kind of work, its scope, its
effort, its status, and its priority. 

Here's what the labels mean:

  - `a:*` — The **area** that the change affects.
  - `c:*` — The **category** describes which module was affected (if any).
  - `e:*` — The **effort** labels define how much effort resolving a particular
    issue is likely to take.
  - `p:*` — The **priority** labels define how urgent resolving a particular
    issue is.

Kind labels:

  - `k:Enhancement` — The task refers to something that improves the Folktale
    library, such as adding new features or making existing features easier
    to use.
  - `k:Error` — The task refers to a problem with the Folktale library. We
    consider problems not only bugs, but things like missing documentation and
    confusing behaviour.
  - `k:Optimisation` — The task doesn't change anything about the behaviour of
    Folktale, but it improves the performance of some of its components.


Other kind labels:

  - `k:Question` — Discussions about features that don't fit any of the
    kinds above.
  - `k:Fix` — A patch for a problem that exists in Folktale.
  - `k:Feature request` — A request for a feature without a concrete proposal for one.
  - `k:Feature proposal` — A request for a feature with a concrete proposal.
  - `k:Refactoring` — A patch that does not change the behaviour of Folktale, but improves maintenance work.


Status labels:

  - `s:Duplicate` — The issue is already covered by a separate issue, and
    should be discussed there.
  - `s:Invalid` — The issue is not a problem in Folktale.
  - `s:Won't Fix` — The issue does not fit Folktale's philosophy.

All triaged issues will at least contain an `area` label and a `kind` label.


## Repository

The Folktale repository is organised as follows:

  - `/folktale` — Root of the project.

    Configuration files:

      - `.eslintrc.json`
         — Linting rules for ESLint.
      - `package.json`
        — Dependencies for tooling used in the repository.
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
        — A guide for people who want to contribute to Folktale.
      - `README.md`
        — Tells people what Folktale is for, how to install it, how to begin using it, where to get support, and other important information.
      - `LICENCE`
        — The licence under which Folktale is released (MIT).
      - `CONTRIBUTORS`
        — A list of all people who have contributed to Folktale.
      - `annotations/source/`
        — Special markdown/YAML documentation files, separated by language.



    Developer tooling:

      - `build.frp`
        — Furipota definitions for automating things.
      - `tools`
        — Custom tooling written for Folktale.
      - `metamagical/`
        — A set of tools to support documentation and tests.


    Source files:

      - `packages/**/source/`
        — The implementation of Folktale libraries.
      - `test/source/`
        — Unit tests for Folktale, using Mocha.


## Source hierarchy

The source tree is organised as a hierarchy of objects. At each level you have
an `index.js` file that re-exports functions and objects of that level. This
allows people to import bags of features, or a particular feature separately.


## Test hierarchy

Folktale uses Mocha for testing, which expects tests to go in the `test/source/specs/`
folder. Right now all test files are placed directly in that folder.

Test files are named `<category>/<subcategory>.js` (e.g.: `core/lambda.js`),
and provide tests for all functionality defined in that category. When compiled,
this generates `<category>/<subcategory>.js` files in the `test/build/specs/` folder.
