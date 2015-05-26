``catchAllPossibleErrors``
==========================

.. apifunction:: control.async.catchAllPossibleErrors

   Ideally you wouldn't care about reifying errors thrown by synchronous
   computations, but this might come in handy for some lifted computations.

   .. warning::

      **Special care should be taken when using this method, since it'll reify
      *ALL* errors (for example, OutOfMemory errors, StackOverflow errors,
      ...), and it can potentially lead the whole system to an unstable
      state.** The :func:`catchOnly` function is favoured over this one, since
      you can decide which errors should be caught and reified in the task,
      and have all the others crash the process as expected.
