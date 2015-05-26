**********************
Module: ``data.maybe``
**********************

.. apimodule:: data.maybe

   The class models two different cases:

       *  ``Just α`` — represents a ``Maybe(α)`` that contains a value. ``α``
          may be any value, including ``null`` and ``undefined``.

       *  ``Nothing`` — represents a ``Maybe(α)`` that has no values. Or a
          failure that needs no additional information.


   Loading
   -------

   Require the ``data.maybe`` package, after installing it::

       var Maybe = require('data.maybe')

   This gives you back a :class:`data.maybe.Maybe` object.


   Why?
   ----

   The ``Maybe(α)`` structure explicitly models the effects that are implicit
   in ``Nullable`` types, thus has none of the problems associated with using
   ``null`` or ``undefined``, such as ``NullPointerException`` or ``TypeError:
   undefined is not a function``.

   Common uses of this structure includes modelling values that may or may not
   be present. For example, instead of having both a ``collection.has(a)`` and
   ``collection.get(a)`` operation, one may have the ``collection.get(a)``
   operation return a ``Maybe(α)`` value. This avoids a problem of data
   incoherence (specially in asynchronous collections, where a value may be
   added between a call to ``.has()`` and ``.get()``!).

   Another common usage is for modelling functions that might fail to provide a
   value. E.g.: ``collection.find(predicate)`` can safely return a ``Maybe(α)``
   instance, even if the collection allows nullable values.


   Additional resources
   --------------------

   *  `A Monad in Practicality: First-Class Failures`_ —
      A tutorial showing how the Either data structure can be used to model failures.

   .. _`A Monad in Practicality: First-Class Failures`: http://robotlolita.me/2013/12/08/a-monad-in-practicality-first-class-failures.html
   
   
.. toctree::
   :hidden:

   Maybe
