*******************
Function: ``apply``
*******************

.. apifunction:: core.lambda.apply

Examples
--------

::

    var inc = function(a){ return a + 1 }
    apply(inc)(3)        // => 4

``apply`` can be used, together with :func:`core.lambda.flip` in higher order
functions when mapping over a collection, if you want to apply them to some
constant argument::

    var fns = [
      function(a){ return a + 2 },
      function(a){ return a - 2 },
      function(a){ return a * 2 },
      function(a){ return a / 2 }
    ]
    
    fns.map(flip(apply)(3)) => [5, 1, 6, 1.5]
