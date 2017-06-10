---
title: Contributing new features
prev_doc: v2.0.0/contributing/bugfixes
next_doc: v2.0.0/contributing/documentation
---

This guide shows how you can propose the implementation of new features for Folktale.


## Contents
{:.no_toc}

* TOC
{:toc}


## Before you start…

Folktale has a [roadmap](https://github.com/origamitower/folktale/blob/master/ROADMAP.md) which summarises the vision for the future of the library. Points in this roadmap are broken down into features, and detailed on the issue tracker as a feature proposal. 

> **Important**
> If a feature is not in the roadmap, please [submit a feature request]({% link _docs/support/feature-request.md %}) explaining why it should be added before you start to work on it.
{:.note}


### Specified features

When features are specified, they get an issue in the [GitHub issue tracker](https://github.com/origamitower/folktale/issues) with a `k:Feature` label. An issue marked as `in progress` means that someone's already working on it. If it's not, please comment on the issue so you can be assigned to it.


### Features on the roadmap

If a feature is in the roadmap, but doesn't have a specification on GitHub yet you can create an issue to discuss how that feature could be implemented.



## Setting things up for the first time

Once you're ready to start working on implementing the feature, you'll want to [get your own copy of Folktale](https://guides.github.com/activities/forking/). After forking, you can clone your repository to start working on it. GitHub has [a visual guide for this workflow](https://guides.github.com/introduction/flow/), which you may want to read if you're not familiar with it.

Make sure you've got [the development tools Folktale uses]({% link _docs/v2.0.0/contributing/setup.md %}) installed. It can take some work setting it up on Windows, unfortunately. We'll be improving this soon!

Once you've got everything installed, and after you've cloned the repository, you'll need to initialise the tools. This can be done by issuing the following commands in the command line, inside the root of the project:

    $ npm install
    $ git submodule init
    $ git submodule update
    $ make tools

> **NOTE**
> The `$` is not part of the command, but rather indicates that you should run the command with your regular user account, instead of an administrator account.
{:.note}


## File headers

All JavaScript files in the project should start with the following preamble:

{% highlight js %}
//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------
{% endhighlight %}


## Making your changes

Once you've got everything set up you're ready to make your changes. Fire up your favourite code editor to make your changes. Now, as you make your changes, you'll probably want to test them. Because Folktale uses some non-standard JavaScript features in its codebase, you'll have to compile the files first before being able to use them.

To compile the files, run:

    $ make compile

At the root of the project. This will generate the compiled files at the root as well, and you can require them right from the Node.js REPL, like so:

    >> var folktale = require('.');
    >> folktale.core.lambda.identity('hello');
    'hello'


## Adding tests

Every feature patch should include automated tests. These tests should cover the possible usages of the functionality in question, and ideally be described as mathematical properties, so they can be ran over a broad range of inputs. Refer to the [test writing guide]({% link _docs/v2.0.0/contributing/tests.md %}) for details :)


## Adding documentation

Every feature patch should include documentation for the public-facing functions, objects, and modules that it introduces.

Documentation consists of two parts:

  - A meta-data annotation at the point where the entity is defined, in the JavaScript code.
  - A markdown prose, with examples, in the `docs/source/en` folder.

Meta-data is attached to entities using a YAML doc comment. It's required to define the `stability` of all entities. For functions, the `type` is required, and when non-trivial, a `complexity` annotation describing the algorithimic complexity in [Big O notation](https://en.wikipedia.org/wiki/Big_O_notation).

{% highlight js %}
/*~
 * stability: stable
 * type: |
 *   forall a, b, c: ((b) => c, (a) => b) => (a) => c
 */
const compose = (f, g) => (value) => f(g(value))
{% endhighlight %}

The [documentation guide]({% link _docs/v2.0.0/contributing/documentation.md %}) goes into more details about meta-data annotations and markdown documentation.


## Crediting yourself

If it's your first time contributing to the project, please take your time to add your name to the `CONTRIBUTORS.md` file at the root of the project as well. Just add a new line with the following format:

    - Your Preferred Name (Your URL) <email@address>

For example:

    - Quil (http://robotlolita.me/) <queen at robotlolita.me>

All fields besides the name are optional. As for the name, just pick any that you're comfortable with being public (it can be your GitHub username, for example). It doesn't have to be your real name.


## Before proposing your changes…

Make sure all existing tests pass by running:

    $ make test-all

Make sure your code conforms to the coding style used by the project by running:

    $ make lint


## Proposing your changes

Once you're done making your changes, [open a pull request](https://help.github.com/articles/creating-a-pull-request/) to propose your changes. You may also open a pull request for work in progress if you want to discuss the changes, or want guidance on some aspect of the code.

A Pull Request is pretty much a way of opening a discussion on some code. Don't be afraid of showing something that you think is unfinished or could be better, we're here to help (and we don't bite!).

Once we're both happy with the changes, it gets merged in the main branch of Folktale, and scheduled for the next release.

That's it! Thanks so much for your help :)
