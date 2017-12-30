---
title: Contributing tests
prev_doc: v2.0.0/contributing/documentation
next_doc: v2.0.0/contributing/git-guidelines
---

Folktale uses [Mocha](https://mochajs.org/) and
[JSVerify](https://github.com/jsverify/jsverify) for tests. Property-based tests
are preferable, but sometimes example-based tests make more sense, Amanda
Laucher and Paul Snively have a very good
[talk about when to use Property-based tests and when to use example-based tests](https://www.infoq.com/presentations/Types-Tests),
which you can use as a basis to make this decision.


## Contents
{:.no_doc}

* TOC
{:toc}


## Setting things up for the first time

You'll want to [get your own copy of Folktale](https://guides.github.com/activities/forking/). After forking, you can clone your repository to start working on it. GitHub has [a visual guide for this workflow](https://guides.github.com/introduction/flow/), which you may want to read if you're not familiar with it.

Make sure you've got [the development tools Folktale uses]({% link _docs/v2.1.0/contributing/setup.md %}) installed by running `npm install` at the Folktale directory:

    $ npm install

> **NOTE**
> The `$` is not part of the command, but rather indicates that you should run the command with your regular user account, instead of an administrator account.
{:.note}


## Making your changes

Once you've got everything set up you're ready to make your changes. Fire up your favourite code editor and change the relevant files. Folktale tests are stored in the `test/source` folder, and you'll usually want to change the files in the `specs/` subfolder.


### Property-based tests

Here's an example of how one would write tests for the `compose` function, in a
`test/source/specs/base/core/lambda.js` file:

```js
// Import the jsverify library. This will be used to define the tests
const { property } = require('jsverify');

// Import the category we're testing (core.lambda). By convention, the
// variable `_` is used to hold this object, since it has less visual
// clutter.
const _ = require('folktale').core.lambda;

// Define the test case. Mocha adds the `describe` function to define
// a test suite. You should create a suite for the category, and a
// suite for the function being tested inside of that:
describe('Core.Lambda', () => {
  describe('compose', () => {
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


### Example-based tests

Sometimes it makes more sense to write an example-based test than a
property-based one. For these, instead of the `property` function from JSVerify,
test cases are defined with the `it` function from Mocha, and assertions use
Node's native `assert` module:

```js
const assert = require('assert');
const _ = require('folktale').core.lambda;

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


## Running tests

To run tests in Node, use the `furipota run test` command. This will compile all of the source and all of the tests, then run the tests with Mocha in Node and in the browser (using PhantomJS).

    $ ./node_modules/.bin/furipota run test

By default browser tests are ran only in PhantomJS, but this is configurable through the `test/karma-local.js` file.


## Crediting yourself

If it's your first time contributing to the project, please take your time to add your name to the `CONTRIBUTORS.md` file at the root of the project as well. Just add a new line with the following format:

    - Your Preferred Name (Your URL) <email@address>

For example:

    - Quil (http://robotlolita.me/) <queen at robotlolita.me>

All fields besides the name are optional. As for the name, just pick any that you're comfortable with being public (it can be your GitHub username, for example). It doesn't have to be your real name.


## Proposing your changes

Once you're done making your changes, [open a pull request](https://help.github.com/articles/creating-a-pull-request/) to propose your changes. You may also open a pull request for work in progress if you want to discuss the changes, or want guidance on some aspect of the code.

A Pull Request is pretty much a way of opening a discussion on some code. Don't be afraid of showing something that you think is unfinished or could be better, we're here to help (and we don't bite!).

Once we're both happy with the changes, it gets merged in the main branch of Folktale, and scheduled for the next release.

That's it! Thanks so much for your help :)