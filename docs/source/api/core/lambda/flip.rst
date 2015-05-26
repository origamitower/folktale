******************
Function: ``flip``
******************

.. apifunction:: core.lambda.flip

Examples
--------

::

   var subtract = function(a){ return function(b){ return a - b }}

   subtract(3)(2)               // => 1
   flip(subtract)(3)(2)         // => -1

Flip can be used to partially apply the second argument in a binary curried
function. It makes it much easier to create new functionality, by just applying
functions, rather than explicitly creating new ones::

    var divide = curry(2, function(a, b) {
      return a / b
    })

    var dividedBy = curry(2, function(a, b) {
      return b / a
    })

    var dividedBy5 = function(a) {
      return divide(a, 5)
    }

    // Instead you could write:
    var dividedBy  = flip(divide)
    var dividedBy5 = dividedBy(5)
