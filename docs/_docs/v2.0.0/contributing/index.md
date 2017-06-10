---
title: Contributing to Folktale
permalink: /docs/v2.0.0/contributing/
breadcrumb: [v2.0.0]
next_doc: v2.0.0/contributing/setup
---

Hi~☆! Thanks for the interest in contributing to Folktale! Your help is much appreciated, and this guide will give you some pointers on what you can do to make things go as smoothly as possible. Don't worry about making mistakes, though! These aren't hard rules, and we're here to help you on anything you need :)

First of all…

> **Code of Conduct**
> Folktale aims to be a friendly, welcoming, and inclusive community, so we have a few rules in place to ensure that. In short: **be respectful**, but you can see the full details of expectations and enforcement on the [Code of Conduct]({% link coc.html %}) page.
{:.note}


## Contents
{:.no_toc}

* TOC
{:toc}


## How can I contribute?

Folktale is currently accepting four types of contributions:

  - [**Bug fixes**]({% link _docs/v2.0.0/contributing/bugfixes.md %}):  
    small patches that fix an existing problem with Folktale. You can get started by taking a look at the selection of [good first issues](https://github.com/origamitower/folktale/issues?q=is%3Aopen+is%3Aissue+label%3A%22e%3AGood+First+Issue%22). These are smaller, simpler issues that can help you get used to Folktale and open source contributions :)
  
  - [**Documentation improvements**]({% link _docs/v2.0.0/contributing/documentation.md %}):  
    patches that improve phrasing or flow of a particular document, fix typos, or add missing documentation for existing features.
  
  - [**Test improvements**]({% link _docs/v2.0.0/contributing/tests.md %}):  
    patches that fix existing test cases, or add missing ones.
  
  - [**Implementations of features in the roadmap**]({% link _docs/v2.0.0/contributing/new-features.md %}):  
    patches that implement new features that **have been properly specified, with the proposal added to the GitHub issue tracker**. If a feature isn't in the roadmap, please [open a discussion for why it should be included]({% link _docs/support/feature-request.md %}) instead.


## The contribution process

All of these contributions happen through GitHub, and they follow the same basic process. GitHub has a [neat visual guide for its GitHub flow](https://guides.github.com/introduction/flow/).

In order to contribute, you have to [create a GitHub account](https://github.com/) (if you haven't yet), and [fork the Folktale repository](https://github.com/origamitower/folktale). This will give you your own copy of the Folktale code, which you can modify as you please. Once you're ready to propose your changes, open a pull request on the Folktale repository. GitHub has [a guide for this fork/pull-request cycle](https://guides.github.com/activities/forking/) if you're not familiar with it.

A Pull Request is pretty much a way of starting a dialogue about some changes. We'll review the changes, and sometimes we may ask for some additional changes, or suggest some improvements. Once we and you agree that the changes are good, they are merged in the main codebase for Folktale, and scheduled to be released in the next version.


## How do I make my changes?

Some changes can be as simple as hitting the *edit* button in the file on the GitHub website, and proposing the change. Fixing typos in the documentation doesn't really need anything else. For code changes, however, you'll want to download the code, so you can edit it in your favourite code editor, and test your changes as you make them. This requires [setting up a development environment]({% link _docs/v2.0.0/contributing/setup.md %}).

Detailed instructions on how to make your changes and test them are provided in the pages for each type of contribution.


## Do I own my contribution?

Yes. But you also agree to release it under the same terms in which Folktale is licensed, the [MIT licence](https://github.com/origamitower/folktale/blob/master/LICENCE). See the [GitHub terms of service](https://help.github.com/articles/github-terms-of-service/#6-contributions-under-repository-license) for details. In essence, this ensures that Folktale users can use your work in their projects :)
