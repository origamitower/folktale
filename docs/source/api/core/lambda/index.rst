***********************
Module: ``core.lambda``
***********************

.. apimodule:: core.lambda

   Loading
   -------

   Require the ``core.lambda`` package, after installing it::

       var lambda = require('core.lambda')


   Why?
   ----

   Functional programming places heavy emphasis in composition (specially
   function composition), but JavaScript lacks built-in functionality for
   composing and transforming functions in order to compose
   them. ``core.lambda`` fills this gap by providing tools for composing
   functions, altering the shape of a function in order to compose them in
   different ways, and currying/uncurrying.


.. toctree::
   :hidden:

   identity
   constant
   apply
   flip
   compose
   curry
   spread
   uncurry
   upon
