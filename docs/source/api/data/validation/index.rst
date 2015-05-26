***************************
Module: ``data.validation``
***************************

.. apimodule:: data.validation   

   Loading
   -------

   Require the ``data.validation`` package, after installing it::

       var Validation = require('data.validation')

   This gives you back a :class:`data.validation.Validation` object.


   Why?
   ----

   The ``Validation(α, β)`` is a disjunction that's more appropriate for
   validating inputs, and aggregating failures. It's isomorphic to
   :mod:`data.either`, but provides better terminology for these use cases
   (``Failure`` and ``Success``, versus ``Left`` and ``Right``), and allows one
   to aggregate failures and successes as an Applicative Functor.


   Additional resources
   --------------------

   *  `A Monad in Practicality: First-Class Failures`_ —
      A tutorial showing how the Validation data structure can be used to model
      data validations.

   .. _`A Monad in Practicality: First-Class Failures`: http://robotlolita.me/2013/12/08/a-monad-in-practicality-first-class-failures.html


   

.. toctree::
   :hidden:

   Validation
