*******************
Function: ``curry``
*******************

.. apifunction:: core.lambda.curry

Examples
--------

::

   function sub3(a, b, c){ return a - b - c }

   curry(3, sub3)(5)(2)(1)      // => 2
   curry(3, sub3)(5, 2)(1)      // => 2
   curry(3, sub3)(5)(2, 1)      // => 2
   curry(3, sub3)(5, 2, 1)      // => 2
   curry(3, sub3)(5, 2, 1, 0)   // => TypeError: 2 is not a function

