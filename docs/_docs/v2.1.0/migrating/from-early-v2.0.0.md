---
title: …from v2.0.0 pre-releases
prev_doc: v2.1.0/migrating/from-data.validation
---

Several breaking changes happened during the pre-releases of Folktale 2, these ensure that the future versions don't need to break anything or live with things that turned out to be bad design decisions. This lists these changes, and how to migrate.


## Contents
{:.no_toc}

* TOC
{:toc}


## Package re-organisation

Most modules in the Base package were moved to allow planned modules to be added without problems.

  - `folktale/data/future` is now `folktale/concurrency/future`.
  - `folktale/data/task` is now `folktale/concurrency/task`.
  - `folktale/data/conversions` is now `folktale/conversions`.
  - `folktale/core/fantasy-land` is now `folktale/fantasy-land`.
  - `folktale/data/maybe` is now `folktale/maybe`.
  - `folktale/data/result` is now `folktale/result`.
  - `folktale/data/validation` is now `folktale/validation`.

There were no behaviour or name changes in the modules above, so the only thing that needs to change is your import expression.


## Core.ADT

In the beginning the `core/adt` module was used as a synonymous for tagged unions. To support both sum and product types in the future this has changed a bit.

The `folktale/core/adt` module is now `folktale/adt/union` module, which specifies that it creates union types. The `data` function was also renamed to `union`, and the `ADT` namespace was renamed to `Union` — although this one was used mostly internally.

**Previously:**

{% highlight js %}
const { data, derivations } = require('folktale/core/adt');

const List = data('List', {
  Empty(){ },
  Cons(value, rest) {
    return { value, rest };
  }
}).derive(derivations.Equality);
{% endhighlight %}

**Now:**

{% highlight js %}
const { union, derivations } = require('folktale/adt/union');

const List = union('List', {
  Empty(){ },
  Cons(value, rest) {
    return { value, rest };
  }
}).derive(derivations.Equality);
{% endhighlight %}


## Alpha versions

Quite a few breaking changes happened during the alpha releases in Folktale. Please see [the Folktale changelog]({% link _docs/v2.1.0/changelog.md %}) for the details.