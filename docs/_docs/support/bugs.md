---
title: Reporting issues
group: support
prev_doc: support/faq
next_doc: support/feature-request
---

Sometimes things don't work as well as they should, or we can't make them work
the way we want, and we get frustrated by that. Both of those are situations
were we encourage you to open an issue in the [GitHub issue tracker](https://github.com/origamitower/folktale/issues) so
we can help you.


## Contents
{:.no_toc}

* TOC
{:toc}


## Before you report a bug…

Opening a ticket is primarily a way of starting a discussion on a particular
problem. In some cases (for example, if you're not sure what the behaviour of
something should be), you might consider sticking around the
[Gitter channel](https://gitter.im/folktale/discussion) and talking to people about it before opening an issue,
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


## Reporting problems in the library

If you're not sure how to format your bug report, here's a template you can follow:

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

    
Here's an example that uses the template above:
    

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
    
    
Of course, you're not required to follow this exact template. It's there for you
to use if you want to, but it doesn't fit all possible tickets.



## Reporting problems in the documentation

If you're reporting an issue with the documentation, for example, your ticket should focus
on what you feel the problem with the documentation is. Maybe the phrasing is
hard to follow, maybe there are grammatical mistakes, maybe it assumes knowledge
of some concept that's not explained anywhere else, maybe it's outdated.

Below is an example of how one could go about reporting an issue with the
documentation:

    The documentation for `Data.Maybe` assumes familiarity with concepts such as
    `Monad` and `Functor` that are not explained anywhere. Maybe it's immediately
    obvious to those people how and when they would choose to use this data
    structure, but I still don't know why I would use it after reading the
    documentation.
    
    I should note that I am a beginner in functional programming, and I think the
    documentation right now could be more clear on its motivations. More concrete
    examples would help.
