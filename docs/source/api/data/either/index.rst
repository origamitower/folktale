***********************
Module: ``data.either``
***********************

.. apimodule:: data.either

   The ``Either(α, β)`` structure represents the logical disjunction between
   ``α`` and ``β``. In other words, ``Either`` may contain either a value of
   type ``α``, or a value of type ``β``, at any given time, and it's possible
   to know which kind of value is contained in it.

   This particular implementation is biased towards right values (``β``), thus
   common projections (e.g.: for the monadic instance) will take the right
   value over the left one.

               
   Loading
   -------

   Require the ``data.either`` package, after installing it::

       var Either = require('data.either')

   This gives you back an :class:`data.either.Either` object.


   Why?
   ----

   A common use of this structure is to represent computations that may fail
   when you want to provide additional information on the failure. This can
   force failures and their handling to be explicit, avoiding the problems
   associated with throwing exceptions: non locality, abnormal exits,
   unintended stack unwinding, etc.


   Additional resources
   --------------------

   *  `A Monad in Practicality: First-Class Failures`_ —
      A tutorial showing how the Either data structure can be used to model failures.

   .. _`A Monad in Practicality: First-Class Failures`: http://robotlolita.me/2013/12/08/a-monad-in-practicality-first-class-failures.html


.. toctree::
   :hidden:

   Either
