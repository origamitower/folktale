********************
Function: ``spread``
********************

.. apifunction:: core.lambda.spread

Examples
--------

.. code-block:: js

   var add = curry(2, function(a, b){ return a + b })

   spread(add)([3, 2])  // => add(3)(2) => 5
    
