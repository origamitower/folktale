*********************
Function: ``uncurry``
*********************

.. apifunction:: core.lambda.uncurry

Examples
--------

.. code-block:: js

   var add = function(a){ return function(b){ return a + b }}

   uncurry(add)(3, 2)   // => add(3)(2) => 5
