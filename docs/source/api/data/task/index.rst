*********************
Module: ``data.task``
*********************

.. apimodule:: data.task


   Loading
   -------

   Require the ``data.task`` package, after installing it::

       var Task = require('data.task')

   This gives you back a :class:`data.task.Task` object.


   Why?
   ----

   This structure allows one to model side-effects (specially time-based ones)
   explicitly, such that one can have full knowledge of when they're dealing
   with delayed computations, latency, or anything that isn't pure or can be
   computed immediately.

   A common use of this structure is to replace the usual `Continuation-Passing
   Style`_ form of programming in order to be able to compose and sequence
   time-dependent effects using the generic and powerful monadic operations.

   .. _Continuation-Passing Style: http://matt.might.net/articles/by-example-continuation-passing-style/

   
   Additional resources
   --------------------

   *  `A Monad in Practicality: Controlling Time`_ —
      A tutorial showing how ``Data.Task`` can be used to model time-dependent
      values.

   .. _`A Monad in Practicality: Controlling Time`: http://robotlolita.me/2014/03/20/a-monad-in-practicality-controlling-time.html


.. toctree::
   :hidden:

   Task
