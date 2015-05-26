**********************
Module: ``core.arity``
**********************

.. apimodule:: core.arity

   Loading
   -------

   Require the ``core.arity`` package, after installing it::

       var arity = require('core.arity')


   Why?
   ----
               
   Since all functions in JavaScript are variadic, programmers often
   take advantage of this fact by providing more arguments than what a function
   takes, and the callee can just ignore them. With curried functions, calling
   a binary function with three arguments ends up invoking the return value of
   the function with the extra argument!

   .. code-block:: js

      var curry = require('core.lambda').curry;
      
      function add(a, b) {
        return a + b;
      }

      var cadd = curry(2, add);

      cadd(1)(2)    // => 3
      cadd(1, 2)    // => 3
      cadd(1, 2, 4) // => Error: 3 is not a function


   To fix this, one would need to wrap the curried function such that the
   wrapper only passes two arguments to it, and ignores the additional ones:

   .. code-block:: js

      var binary = require('core.arity').binary;

      binary(cadd)(1, 2, 4) // => 3


