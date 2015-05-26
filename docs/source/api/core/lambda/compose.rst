*********************
Function: ``compose``
*********************

.. apifunction:: core.lambda.compose

Examples
--------

::

   function inc(a){ return a + 1 }
   function square(a){ return a * a }

   compose(inc)(square)(2)      // => inc(square(2)) => 5
