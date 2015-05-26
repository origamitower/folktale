API Reference
=============

Folktale is a suite of libraries for generic functional programming in
JavaScript. It allows the construction of elegant, and robust programs, with
highly reusable abstractions to keep the code base maintainable.

The library is organised by a variety of modules split into logical categories,
with the conventional naming of ``<Category>.<Module>``. This page provides
reference documentation for all the modules in the Folktale library, including
usage examples and cross-references for helping you find related concepts that
might map better to a particular problem.


Core
----

Provides the most basic and essential building blocks and compositional
operations, which are likely to be used by most programs.

* :doc:`core.arity <core/arity/index>`
      Restricts the arity of variadic functions.

* :doc:`core.check <core/check/index>`
      Run-time interface checking/contracts for JavaScript values.

* :doc:`core.inspect <core/inspect/index>`
      Human-readable representations of built-in and custom objects.

* :doc:`core.lambda <core/lambda/index>`
      Essential functional combinators and higher-order functions derived from
      λ-Calculus.

* :doc:`core.operators <core/operators/index>`
      Curried and first-class versions of JavaScript built-in operators.


.. toctree::
   :hidden:

   core/arity/index
   core/check/index
   core/inspect/index
   core/lambda/index
   core/operators/index


Control
-------

Provides operations for control-flow.

* :doc:`control.monads <control/monads/index>`
      Common monadic combinators and sequencing operations.

* :doc:`control.async <control/async/index>`
      Common operations for asynchronous control-flow with :doc:`Data.Task
      <data/task/index>`.

.. toctree::
   :hidden:

   control/monads/index
   control/async/index
   

Data
----

Provides functional (persistent and immutable) data structures for representing
program data.

* :doc:`data.either <data/either/index>`
      Right-biased disjunctions. Commonly used for modelling computations that
      may fail with additional information about the failure.

* :doc:`data.maybe <data/maybe/index>`
      Safe optional values. Commonly used for modelling computations that may
      fail, or values that might not be available.

* :doc:`data.task <data/task/index>`
      A structure for capturing the effects of time-dependent values
      (asynchronous computations, latency, etc.) with automatic resource
      management.

* :doc:`data.validation <data/validation/index>`
      A disjunction for validating inputs and aggregating failures. Isomorphic
      to :doc:`Data.Either <data/either/index>`.
  
.. toctree::
   :hidden:

   data/either/index
   data/maybe/index
   data/task/index
   data/validation/index
   
