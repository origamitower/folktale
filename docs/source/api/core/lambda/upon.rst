******************
Function: ``upon``
******************

.. apifunction:: core.lambda.upon

Examples
--------

::

    // Sorting an array of pairs by the first component
    
    var xss = [[1, 2], [3, 1], [-2, 4]]
    
    function compare(a, b) {
      return a < b?     -1
      :      a === b?    0
      :      /* a> b */  1
    }
    
    function sortBy(f, xs) {
      return xs.slice().sort(f)
    }
    
    sortBy(upon(compare, first), xs)  // => [[-2, 4], [1, 2], [3, 1]]
