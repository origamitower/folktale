Folktale by Example
===================

.. warning::

   **This book is a work in progress!**
   
   This is largely a draft at this point, so if you see any problems, feel free
   to `file a ticket <https://github.com/folktale/folktale/issues>`_
   and I'll get to fixing it up asap.


Category Theory is a relatively new branch of mathematics with fairly abstract
concepts. Functional programming libraries use such concepts for maximising
their abstraction power and general usefulness, but it comes with a certain
drawback: most of the constructions provide little or no guidance for concrete
use cases. This is a problem in particular with newcomers to this style of
programming, who often find themselves lost, asking questions like “But why are
Monads useful?”

In this book, you will walk through concrete applications of concepts in
Category Theory, Abstract Algebra, and other branches of mathematics used by
functional programming, as well as concepts from functional programming
itself. By looking at concrete instances of these concepts, you can build a
mental framework for generalising and abstracting problems in a way that makes
your code more reusable, and more robust.

.. note::

   Do note that this isn't a book *about* Category Theory or any other
   mathematical field, the concepts presented in this book are just influenced
   by them.


Approach
--------

People tend to have a fairly difficult time reasoning about abstractions, but
they can easily recognise concrete instances of those abstractions. With enough
examples, they can then build their own mental model of that abstraction and,
having that mental model, they'll be able to apply that generalisation to find
other concrete instances of that abstractions on their own.

With that in mind, this book tries to present its readers with concrete
applications of a concept before discussing the concept itself. It does so by
presenting, at each chapter, a set of related problems, discussing concrete
solutions for those problems, and finally extrapolating to a general solution
that captures the *pattern* in those concrete solutions.


Who should read this book?
--------------------------

This book is aimed at intermediate and advanced JavaScript programmers who want
to take advantage of mathematical concepts to make their JavaScript code bases
simpler, more robust and reusable.

You're expected to be comfortable not only with the syntax and basic concepts of
the JavaScript language, but also with concepts such as **higher-order
programming**, **first-class functions**, **objects**, **prototypes**, and
**dynamic dispatch**, which are going to be the basis for the concepts discussed
in this book. Non-JavaScript programmers familiar with those concepts might be
able to translate the concepts to their languages, with some work, but a
different book might be better suited for their needs.

To make the most out of this book, you'll also need some school-level
mathematical reasoning skills, since the generalisation of the concepts will be
presented as mathematical laws. Properly understanding them will take some
knowledge of equality, substitutability and unification. Albert Y. C. Lai has
described the `prerequisite mathematical skills`_ for functional programming on
a web page.

.. _prerequisite mathematical skills: http://www.vex.net/~trebla/haskell/prerequisite.xhtml


How is this book organised?
---------------------------

The book is split into a few sections, each section starts with a description
its theme, prerequisites and motivation, spends a few chapters talking about
concrete examples inside that theme, and concludes with a summary of the
abstractions presented. Sections build on top of each other, so it might be
difficult to read the book in a non-linear way.

**Section 1** discusses functions, and how composition can be used to build new
functionality from existing one easily, as well as how JavaScript function
affect composition in JS. It presents the ``core.lambda``, ``core.arity`` and
``core.operator`` libraries.

**Section 2** discusses data structures and their transformations. It talks
about concepts such as *Functors* and recursion schemes such as
*Catamorphisms*. This section also gives a general idea of how *sum types* are
modelled in **Folktale**. It presents the ``data.maybe``, ``data.either`` and
``data.validation`` libraries.

**Section 3** discusses advanced transformations of data structures. It talks
about concepts such as *Applicative Functors* and *Monads*. It presents new
facets of the libraries presented in **Section 2**.

**Section 4** discusses approaches to asynchronous concurrency when dealing with
simple values. It revisits *Monads*, and talks about new concepts such as
*Continuation-Passing style*, *Tasks*, and *Futures*. It presents the
``data.task`` library.

**Section 5** discusses advanced approaches to dealing with multi-value
concurrency. It expands on **Section 4** by presenting new concepts such as
*back-pressure*, *Signals* and *Channels*. It presents the ``data.channel`` and
``data.signal`` libraries.

**Section 6** discusses data validation and normalisation in more detail. It
presents the ``data.validation`` and ``core.check`` libraries.


Examples
--------

The book contains a heavy amount of examples, all of which can be found in the
`Folktale GitHub repository`_, under the ``docs/examples`` folder.

.. _Folktale GitHub repository: https://github.com/folktale/folktale


Table of Contents
-----------------

.. toctree::
   :maxdepth: 2

   section1/index
