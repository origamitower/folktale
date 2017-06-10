---
title: Requesting features
group: support
prev_doc: support/bugs
---

Folktale doesn't do everything, so more often than not you'll find something
that you wish Folktale supported but that isn't implemented yet. Maybe the
thought has never crossed our minds. This is a great opportunity to
[tell us about that feature you want](https://github.com/origamitower/folktale/issues/new).


## Contents
{:.no_toc}

* TOC
{:toc}


## Before you request a feature…

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
ask in the [Gitter channel](https://gitter.im/folktale/discussion).


## Requesting a feature

When you open an issue, it's important to describe clearly what the missing
feature is, and why it is important to have this feature. Examples are a great
way to present the feature and show how it would look like when implemented.

If you're not sure about how to format it, you can follow this template:


    (A short description of what the functionality is)
    
        (An example showing how one would use the functionality)
    
    ### Why?
    
    (Describe why the functionality is important to have in Folktale)
    
    ### Additional resources
    
    (If there are any materials relevant to the suggestion — a paper, a talk on the
    subject, etc. you can provide them here)


Here's an example of a feature request using this template:


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
