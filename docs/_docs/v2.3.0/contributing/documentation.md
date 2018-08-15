---
title: Contributing documentation
prev_doc: v2.3.0/contributing/new-features
next_doc: v2.3.0/contributing/tests
---

Folktale uses several forms of documentation, and they could always use some improvements. This guide shows how you can contribute to different parts of the documentation in Folktale.


## Contents
{:.no_toc}

* TOC
{:toc}


## How is Folktale documented?

Folktale has three forms of documentation:

  - **Entity metadata**: each function, property, and object in Folktale is annotated with their stability, type, and other information directly in the source code.
  - **API reference**: each function, property, and object in Folktale has a piece of documentation describing at least what it does, and providing a usage example.
  - **Guides**: things like release notes, how to migrate from one version to another, how to contribute to Folktale, etc.

Documentation is a mix of [YAML](http://yaml.org/) and [Markdown](http://commonmark.org/), and is defined both in JavaScript and Markdown files in the repository.


## Entity metadata

Each entity in Folktale has metadata associated with it, through [Meta:Magical](https://github.com/origamitower/metamagical). Metadata is provided directly in the JavaScript source files, with a meta-data comment — multi-line comments that start with the `~` character.

For example, a meta-data for `identity` would look like this:

{% highlight js %}
/*~
 * stability: stable
 * type: |
 *   forall a. (a) => a
 */
const identity = (a) => a;
{% endhighlight %}

The metadata itself is described as a YAML object. The following keys are supported:

  - `stability`: Defines how stable the feature is. May be one of `experimental`, `deprecated`, `stable`, or `locked`. Possible values are explained in the [stability index]({% link _docs/v2.3.0/misc/stability-index.md %}) document. E.g.:

        /*~
         * stability: stable
         */

  - `type`: Describes the type of the entity. The [type notation guide]({% link _docs/v2.3.0/misc/type-notation.md %}) explains the type notation used. E.g.:

        /*~
         * type: |
         *   (String) => String
         */

  - `complexity`: When a function has non-trivial algorithmic complexity, its complexity in [Big O notation](https://en.wikipedia.org/wiki/Big_O_notation). E.g.:

        /*~
         * complexity: O(array.length)
         */


## API Reference

API documentation is stored in Markdown files in the `annotations/source` directory. It follows the same folder structure as the source being documented, but folder structure does not affect the documentation. Instead, the object to be documented is defined with a `@annotate: <JS expression>` line preceding the documentation.

An `@annotate` command has the following basic structure:

```
@annotate: <JS expression>
<YAML document with additional metadata>
---
<Documentation in Markdown>
```

The `<JS expression>` is any JS expression that evaluates to the object that will be documented. `<YAML document>` is a set of [Meta:Magical](https://github.com/origamitower/metamagical) metadata, with `category` being a required one. And `<Documentation>` is just prose written in Markdown.

For example, an `@annotate` command for the `core/lambda/compose` function would look like this:

```md
@annotate: folktale.core.lambda.compose
category: Combining functions
---

Combines two unary functions, from right to left.

## Example::

    const compose = require('folktale/core/lambda/compose');

    const inc = (x) => x + 1;
    const double = (x) => x * 2;

    compose(inc, double)(2);
    // ==> inc(double(2))
```

Multiple objects may be documented at the same time by juxtaposing `@annotate` lines, like so:

```md
@annotate: folktale.data.maybe.Just.prototype.map
@annotate: folktale.data.maybe.Nothing.prototype.map
category: Transforming
---

Documentation for both entities goes here~
```


### How to document an object

The documentation for an entity must at least describe what the feature is, and provide a small example of how to use it. The documentation example for the `compose` function in the previous section illustrates this.

Ideally, however, the documentation for an API should answer many other question, such as why a feature exists, what are the caveats of using it, comparisons with other APIs on an use-case basis, etc. You can look at the [How do I document my code?](https://github.com/origamitower/conventions/blob/master/documentation/how-do-i-document-my-code.md#why-do-we-need-documentation) document for more details.


### Examples in the API reference

Examples in documentation may get out of date. To avoid this, the Folktale annotations use a special syntax to mark the example as executable piece of code. These examples will be executed along with the regular test files in order to verify that they still work.

Adding an executable example to your Markdown prose requires prefixing a Markdown code block with a paragraph or heading ending in double colon (`::`). For example:

```md
## Example::

    // this JS will be executed.
    
A paragraph:

    // This JS will not be executed.

Another paragraph::

    // But this one will.
```

Examples within a heading are executed together. This means that if one code block introduces a variable, it'll be available in the next code block:

```md
# Heading 1::

    const x = 1;

Another paragraph::

    x + 1; // 2

# Heading 2::

    x + 1; // Error: `x` is not defined
```

For expressions, the result of its evaluation can be defined with [arrow comments](https://github.com/origamitower/metamagical/tree/master/packages/babel-plugin-assertion-comments). When an arrow comment is used, the expression preceding it will be compiled to an `assert()` call:

```md
This example::

    x + 1;
    // ==> 2

Is equivalent to::

    const assert = require('assert');

    assert(deepEquals(x + 1, 2), 'x + 1 // ==> 2');
```


## Guides

Finally, this website can also be improved by editing the files in the Folktale repository. Documentation pages are Markdown files in the `docs/_docs` directory, and the `Improve this page` link at the top of each one links directly to the relevant file on GitHub, in edit mode.

To test your changes locally, it's necessary to [configure Jekyll](https://help.github.com/articles/setting-up-your-github-pages-site-locally-with-jekyll/), install Stylus with `npm` to compile the CSS, and run Jekyll from the `docs` folder.
