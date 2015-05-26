************************
Module: ``core.inspect``
************************

.. apimodule:: core.inspect

   Loading
   -------

   Require the ``core.inspect`` package, after installing it::

       var inspect = require('core.inspect')

   The module itself is a specialised form of :func:`core.inspect.show` that
   has a limited ``maxDepth``::

       inspect([1, [2, [3, [4, [5, [6]]]]]])
       // => '[1, [2, [3, [4, [5, (...)]]]]]'


   Why?
   ----
               
   Some objects provide a custom representation, some do not. You usually want
   to see the custom textual representation if an object has it, since just
   showing its own properties might not give you enough information about it,
   or might not be as easy to read. But you also want to represent objects that
   don't have a custom representation as something more useful than ``[object
   Object]``. ``core.inspect`` solves this problem.

   Consider a simple custom type representing a point in a 2d plane::
   
       function Point2d(x, y) {
         this.x = x;
         this.y = y;
       }
       
       Point2d.prototype.toString = function() {
         return 'Point2d(' + this.x + ', ' + this.y + ')'
       }

   If one wants to print a textual representation of this type, they'd call
   ``Point2d.toString()``::

       var p1 = new Point2d(10, 20);
       p1.toString()
       // => (String) "Point2d(10, 20)"

   But what if you don't know if the object you're dealing with has a custom
   textual representation or not? In that case, you'd usually try to just
   display its properties::

       var Maybe = require('data.maybe');
     
       var player = {
         lastPosition: Maybe.Nothing(),
         currentPosition: Maybe.Just(new Point2d(10, 20))
       }

       player

       // => {
       //      "lastPosition": {},
       //      "currentPosition": {
       //        "value": {
       //          "x": 10,
       //          "y": 20
       //        }
       //      }
       //    }
       
   In this example we have no way of knowing that ``lastPosition`` contains a
   ``Maybe.Nothing`` value, or that ``currentPosition`` is wrapped in a
   ``Maybe.Just``. A more informative description would be what
   ``core.inspect`` gives you::

       var show = require('core.inspect');

       show(player);
       // => '{"lastPosition": Maybe.Nothing, "currentPosition": Maybe.Just(Point2d(10, 20))}'
       

