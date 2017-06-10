---
title: Contributing bugfixes
prev_doc: v2.0.0/contributing/setup
next_doc: v2.0.0/contributing/new-features
---

While we do our best to write correct software, sometimes bugs will escape our tests and creep in. We really appreciate any contribution to fix these issues.


## Contents
{:.no_toc}

* TOC
{:toc}


## Before you start…

Bugs are controlled in the [GitHub issue tracker](https://github.com/origamitower/folktale/issues), and that's also how we track work on fixing each of them. If an issue is marked as `in progress`, then someone is already working on it. If it's not, please comment on the issue so we can assign you to it. That makes it less likely that two people'd work on the same issue :)


## Setting things up for the first time

Once you're ready to work on fixing the bug, you'll want to [get your own copy of Folktale](https://guides.github.com/activities/forking/). After forking, you can clone your repository to start working on it. GitHub has [a visual guide for this workflow](https://guides.github.com/introduction/flow/), which you may want to read if you're not familiar with it.

Make sure you've got [the development tools Folktale uses]({% link _docs/v2.0.0/contributing/setup.md %}) installed. It can take some work setting it up on Windows, unfortunately. We'll be improving this soon!

Once you've got everything installed, and after you've cloned the repository, you'll need to initialise the tools. This can be done by issuing the following commands in the command line, inside the root of the project:

    $ npm install
    $ git submodule init
    $ git submodule update
    $ make tools

> **NOTE**
> The `$` is not part of the command, but rather indicates that you should run the command with your regular user account, instead of an administrator account.
{:.note}


## Making your changes

Once you've got everything set up you're ready to make your changes. Fire up your favourite code editor and change the relevant files. Now, as you make your changes, you'll probably want to test them. Because Folktale uses some non-standard JavaScript features in its codebase, you'll have to compile the files first before being able to use them.

To compile the files, run:

    $ make compile

At the root of the project. This will generate the compiled files at the root as well, and you can require them right from the Node.js REPL, like so:

    >> var folktale = require('.');
    >> folktale.core.lambda.identity('hello');
    'hello'


## Adding some automated tests

Bugs generally happen because we hadn't thought of that case, and there was nothing in our tests to warn of that possibility. If we don't add those tests, chances are this thing will be broken again in the future. That's not great for users, and certainly not nice feeling that you've spent time fixing something only to see it get broken again.

So, in order to avoid that, you should include some tests to check the particular behaviour you're fixing. These tests should **fail** before applying your change, and pass after applying your change. We have a separated [guide on how to write tests for Folktale]({% link _docs/v2.0.0/contributing/tests.md %}).


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
