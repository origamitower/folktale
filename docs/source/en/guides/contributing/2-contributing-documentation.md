@guide: Improving Folktale's documentation
category: 3. Contributing
authors:
  - "@robotlolita"
---

Found a typo in the documentation, or think that something is missing from it, and want to help fixing that? Read on.

* * *

Folktale uses a dialect of Markdown for documentation and some tools to process that. This dialect of Markdown lets one associate documentation with JavaScript objects, and then we can use that to show API documentation on the REPL or render it to HTML.

These Markdown files live in the `docs/source/` directory, separated by a language identifier (currently only English, `en/`, is supported). You can edit these files in any text editor you like, but to test your changes you'll need to [set up a development environment for Folktale](guides.setting-up-a-development-environment.html).

To look at the HTML docs, run `make documentation` at the root of the repository, and open `docs/api/en/folktale.html` in your browser. To test the examples in the docs, run `make test-documentation`.


  - [Documenting a new entity](#documenting-a-new-entity)
  - [Improving existing documentation](#improving-existing-documentation)
  - [Writing testable examples](#writing-testable-examples)


## Documenting a new entity

To document a new entity, you create a `.md` file inside the `docs/source/<language>` folder, ideally replicating a similar hierarchy to the one found in the source code folder. This file should use the special `@annotate: <JS expression>` line to describe which entity is being annotated. Inside that expression, the `folktale` variable points to the root of the Folktale library.

The `@annotate` line is followed by an [YAML](http://yaml.org/) document that defines the metadata about that entity. The only required metadata right now is `category`, which allows us to group methods and functions in the API reference. Finally, a `---` line separates the metadata from the actual documentation.

The documentation for an entity must contain at least a short summary of what the functionality is for, and an example of how to use it.

For example, if documenting the `compose` function (`core/lambda/compose`), the file would look like:

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

You can put several `@annotate` lines together to associate the same documentation with multiple objects:

```md
@annotate: folktale.data.maybe.Just.prototype.map
@annotate: folktale.data.maybe.Nothing.prototype.map
category: Transforming
---

Documentation for both entities goes here~
```

[JavaScript examples use a special syntax](#writing-testable-examples) to allow them to be tested. Writing testable examples means that we can make sure that the examples in the documentation work with the latest version of the library.


## Improving existing documentation

In order to improve existing documentation, you need to find the file where it's defined inside `docs/source` and edit it. The documentation folder tries to follow the same layout the source folder has, and additionally each method/function gets its own documentation file, that matches the name of that method/function.

A documentation file is consists generally of one or more annotation lines (`@annotate: ...`), followed by an [YAML](http://yaml.org/) document defining metadata, and then a portion of Markdown text that's the textual documentation for that entity. Examples inside should ideally [marked to be testable](#writing-testable-examples).


## Writing testable examples

Documentation examples should, ideally, be runnable. This way we ensure that
all the examples contained in the documentation work with the code they're
documenting.

To mark an example as runnable, just write a regular Markdown codeblock and
end the previous paragraph or heading with two colons (`::`). In the code block,
you indicate the result of expressions using [arrow comments](https://github.com/origamitower/metamagical/tree/master/packages/babel-plugin-assertion-comments),
which support structural (deep) equality.

That is, you could use:

```md
This is a runnable example::

    1 + 1;
    // ==> 2
```

Or:

```md
# This is a runnable example::

    [1].concat([2]);
    // ==> [1, 2]
```