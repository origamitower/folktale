---
title: …from Core.Arity
prev_doc: v2.1.0/migrating
next_doc: v2.1.0/migrating/from-core.lambda
---

Folktale's early versions made heavy use of [currying](https://en.wikipedia.org/wiki/Currying) to make it easy to configure some functions partially. This interacted poorly with JavaScript's curried functions, often resulting in [confusing bugs due to application unrolling](https://github.com/origamitower/folktale/issues/38).

Folktale 2 tries to make better use of ECMAScript 2015+ features instead, and thus avoids currying-by-default. This makes the use of `Core.Arity` largely unnecessary for Folktale functions.

If one wants to restrict the arity of other functions, the recommended way is now to use an [arrow function](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Functions/Arrow_functions).

Previously:

{% highlight js %}
var arity = require('core.arity');

function getOrSet(object) {
  return function(key, value) {
    switch (arguments.length) {
      case 1:
        return object[key];

      case 2:
        return object[key] = value;

      default:
        throw new Error('Invalid argument length');
    }
  };
}

['age', 'name'].map(arity.unary(getOrSet({
  'age': 12,
  'name': 'Alice'
})));
// ==> [12, 'Alice']
{% endhighlight %}

Now:

{% highlight js %}
['age', 'name'].map((key) =>
  getOrSet({
    'age': 12,
    'name': 'Alice'
  })
);
// ==> [12, 'Alice']
{% endhighlight %}