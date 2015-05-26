**********************
Module: ``core.check``
**********************

.. apimodule:: core.check

   Loading
   -------

   Require the ``core.check`` package, after installing it::

       var check = require('core.check')


   Why?
   ----

   JavaScript is an untyped language, and this makes it fairly flexible for
   certain things. More often than not, however, you want to make sure that the
   values going into a certain code path have some kind of structure, to reduce
   the complexity of the whole program. ``core.check`` helps you to do this by
   providing composable contracts::

       check.assert(check.String(1))
       // => Error: Expected 1 to have tag String

       check.assert(check.Or([check.String, check.Boolean])(1))
       // => Error: Expected 1 to have tag String, or 1 to have tag Boolean

   ``core.check`` can also be used for validating data structures without
   crashing the process. All contracts return a ``Validation(Violation, α)``
   result. One can then use the :meth:`~data.validation.Validation.prototype.cata`
   operation on the :class:`data.validation.Validation` object to deal with the
   result of the operation::

       function logString(a) {
         return check.String(a).cata({
           Failure: function(error){ return 'Not a string: ' + a },
           Success: function(value){ return 'String: ' + value }
         })
       }

       logString(1)
       // => 'Not a string: 1'

       logString('foo')
       // => 'String: foo'



.. toctree::
   :hidden:

   Violation
