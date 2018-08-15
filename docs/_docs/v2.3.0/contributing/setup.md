---
title: Setting up a development environment
prev_doc: v2.3.0/contributing
next_doc: v2.3.0/contributing/bugfixes
---

Configuring a development environment for Folktale is currently a little bit
more complicated than it should in some systems, but this guide should help
you achieve that anyway.

## Contents
{:.no_toc}

* TOC
{:toc}


## Git

First of all, you'll have to make sure you have [Git](https://git-scm.com/)
installed. Folktale uses Git repositories, and while while you can use things
like [hg-git](http://hg-git.github.io/) to interact with the repository from
Mercurial, we can't support that.

The Git website has a list of GUI clients for Git, if you're not comfortable
using it from the command line.

## Node

Next you'll need to install [Node.js](https://nodejs.org/en/). The website
provides binaries for all supported platforms. All newer versions of Node come
with npm as well, which you'll use to pull the dependencies of the project.

Note that Folktale requires at least Node 4.x, so if you have an older version
you'll need to upgrade.


## Cloning and initialising the repository

The first thing you'll want to do is
[forking Folktale](https://guides.github.com/activities/forking/). This means
you get a clone of the entire project that you have rights to change as you
wish. Once you have forked Folktale, you can clone your fork:

    $ git clone https://github.com/YOUR_GITHUB_USERNAME/folktale.git

This will create a `folktale` folder containing all of the code in the
project. The first thing you need to do is move in that folder and install all
of the dependencies and development tools that Folktale uses:

    $ cd folktale
    $ npm install


## Development tools

[Folktale uses Furipota for development tooling](https://github.com/origamitower/furipota). From
there you can compile the source code, run tests, perform cleanup routines, or
check your source code for style errors. Furipota is installed as a dev-dependency
when you run `npm install` in the Folktale directory.

To list the available tasks, use `furipota list` at the root directory:

    $ ./node_modules/.bin/furipota list

**To compile** the source code, use `furipota run compile`:

    $ ./node_modules/.bin/furipota run compile

**To run the tests**, use `furipota run test`:

    $ ./node_modules/.bin/furipota run test

**To build the documentation**, use `furipota run documentation`:

    $ ./node_modules/.bin/furipota run documentation

> **NOTE**  
> that you'll need to have [Ruby](https://www.ruby-lang.org/), [RubyGems](https://rubygems.org/), and [Bundler](http://bundler.io/) installed.

**To check the code style and potential bugs**, use `furipota run lint`:

    $ ./node_modules/.bin/furipota run lint
