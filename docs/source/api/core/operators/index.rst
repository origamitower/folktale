**************************
Module: ``core.operators``
**************************

.. apimodule:: core.operators

   Loading
   -------

   Require the ``core.operators`` package, after installing it::

       var operators = require('core.operators')


   Why?
   ----

   JavaScript's operators are not first-class functions, so using them in a
   higher-order function requires one to wrap the call at the call-site::

       var people = [
         { name: 'Bob', age: 14 },
         { name: 'Alice', age: 12 }
       ]

       people.map(function(person){ return person.name })
       // => ['Bob', 'Alice']

   This defeats some of the compositional nature of functional
   programming. This module provides first-class, curried versions of these
   special operators that you can combine with the usual function composition
   operations::

       var op = require('core.operators')
       people.map(op.get('name'))
       // => ['Bob', 'Alice']

       function compare(a, b) {
         return a > b?    1
         :      a === b?  0
         :   /* a < b */ -1
       }

       var lambda = require('core.lambda')
       people.sort(lambda.upon(compare, op.get('age'))).map(op.get('name'))
       // => ['Alice', 'Bob']


