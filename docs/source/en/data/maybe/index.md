@annotate: folktale.data.maybe
---

A data structure that models the presence or abscence of a value.


## Example::

    const Maybe = require('folktale/data/maybe');
    
    const find = (list, predicate) => {
      for (var i = 0; i < list.length; ++i) {
        const item = list[i];
        if (predicate(item)) {
          return Maybe.Just(item);
        }
      }
      return Maybe.Nothing();
    };
    
    find([1, 2, 3], (x) => x > 2); // ==> Maybe.Just(3)
    find([1, 2, 3], (x) => x > 3); // ==> Maybe.Nothing()
    
    
## Why use Maybe?

Some functions can always return a sensible result for all arguments that
they're given. For example, the `successor` function on natural numbers can
always give back a valid result, regardless of which natural number we give it.
These functions are easier to understand because their results are more
predictable, and we don't have to worry about errors.

Not all functions have this property (of being *total*), though. Functions like
“find an item in this list” or “look up this key in that hashtable” don't always
have an answer, and so one has to think about how they deal with the cases where
the answer is not there. We have to be able to provide *some* kind of answer
to the programmer, otherwise the program can't continue — that is, not
providing an answer is the equivalent of throwing an exception.

In most languages, things like “find an item in this list” will return `null`
(or the equivalent “not an object”) when the item can't be found, but what if
you had a `null` in th list? In others, you can only ask the question “find me
the index of this item in that list”, and when one index can't be found it
answers `-1`, assuming a 0-based indexed structure. But, again, what if I have
an indexed structure where `-1` is a valid index?

Really these questions *require* two answers: “is the item there?”, and if so,
“what is the item?”, and we often need to test for those answers separately.
Maybe is a data structure that helps answering these questions. A Maybe
structure has two cases:

  - `Just(value)` — represents the presence of an answer, and what the answer
    is.
  - `Nothing()` — represents the absence of an answer.
  
If we have maybe, we can change our code from::

    const find1 = (list, predicate) => {
      for (var i = 0; i < list.length; ++i) {
        const item = list[i];
        if (predicate(item)) {
          return item;
        }
      }
      return null;
    };
    
    find1([1, 2, 3], (x) => x > 2); // ==> 3
    find1([1, 2, 3], (x) => x > 3); // ==> null
    
To:

    const Maybe = require('folktale/data/maybe');

    const find2 = (list, predicate) => {
      for (var i = 0; i < list.length; ++i) {
        const item = list[i];
        if (predicate(item)) {
          return Maybe.Just(item);
        }
      }
      return Maybe.Nothing();
    };
    
    find2([1, 2, 3], (x) => x > 2); // ==> Maybe.Just(3)
    find2([1, 2, 3], (x) => x > 3); // ==> Maybe.Nothing()
    
This has the advantage that it's always possible to determine whether a function
failed or not. For example, if we run `find1([null], x => true)`, then it'll
return `null`, but if we run `find1([null], x => false)` it'll also return
`null`! On the other hand, running `find2([null], x => true)` returns
`Maybe.Just(null)`, and `find2([null], x => false)` returns `Maybe.Nothing()`.
They're different values that can be tested.

Another advantage of using a maybe value for these situations is that, since the
return value is wrapped, the user of that function is forced to acknowledge the
possibility of an error, as the value can't be used directly.


## Working with Maybe values

Last section shows how to create Maybe values, but how do we use them? A value
wrapped in a Maybe can't be used directly, so using these values is a bit more
of work. Folktale's Maybe structure provides methods to help with this, and they
can be divided roughly into 3 categories:

  - **Extracting values**: Sometimes we need to pass the value into things that
    don't really know what a Maybe is, so we have to somehow extract the value
    out of the structure. These methods help with that.

  - **Transforming values**: Sometimes we get a Maybe value that doesn't *quite*
    have the value we're looking for. We don't really want to change the status
    of the computation (failures should continue to be failures, successes
    should continue to be successes), but we'd like to tweak the resulting
    *value* a bit. This is the equivalent of applying functions in an expression.

  - **Sequencing computations**: A Maybe is the result of a computation that can
    fail. Sometimes we want to run several computations that may fail in
    sequence, and these methods help with that. This is roughly the equivalent
    of `;` in imperative programming, where the next instruction is only
    executed if the previous instruction succeeds.
    
        
We'll see each of these categories in more details below.


### Extracting values

If we're wrapping a value in a Maybe, then we can use the value by extracting it
from that container. Folktale lets you do this through the `getOrElse(default)`
method:

    const Maybe = require('folktale/data/maybe');

    function get(object, key) {
      return key in object ?  Maybe.Just(object[key])
      :      /* otherwise */  Maybe.Nothing();
    }
    
    const config = {
      host: '0.0.0.0'
    };
    
    const host = get(config, 'host').getOrElse('localhost');
    const port = get(config, 'port').getOrElse(8080);

    `${host}:${port}`; // ==> '0.0.0.0:8080'
    
This works well if the only error handling we need to do is providing a default
value, which is a fairly common scenario when working with Maybe values. For
more advanced error handling Folktale provides more powerful methods that are
described later in this document.


### Transforming values

Sometimes we want to keep the context of the computation (whether it has failed
or succeeded), but we want to tweak the value a little bit. For example, suppose
you're trying to render the first item of a list, which involves generating some
UI elements with the data from that object, but the list can be empty so you
have to handle that error first. We can't use `getOrElse()` here because if we
have an error, we don't want to render that error in the same way. Instead, we
can use `map(transformation)` to apply our rendering logic only to successful
values:

    const Maybe = require('folktale/data/maybe');

    function first(list) {
      return list.length > 0 ?  Maybe.Just(list[0])
      :      /* otherwise */    Maybe.Nothing();
    }
    
    function render(item) {
      return ['item', ['title', item.title]];
    }
    
    first([{ title: 'Hello' }]).map(render);
    // ==> Maybe.Just(['item', ['title', 'Hello']])
    
    first([]).map(render);
    // ==> Maybe.Nothing()
    
    
    




