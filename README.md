Folktale
=======

[![Ready to work on~!](https://img.shields.io/waffle/label/origamitower/folktale/ready.svg?style=flat-square)](http://waffle.io/origamitower/folktale)
[![Chat on Gitter](https://img.shields.io/gitter/room/folktale/discussion.svg?style=flat-square)](https://gitter.im/folktale/discussion)
[![Build status](https://img.shields.io/travis/origamitower/folktale/master.svg?style=flat-square)](https://travis-ci.org/origamitower/folktale)
[![NPM version](https://img.shields.io/npm/v/folktale.svg?style=flat-square)](https://npmjs.org/package/folktale)
[![Dependencies status](https://img.shields.io/david/origamitower/folktale.svg?style=flat-square)](https://david-dm.org/origamitower/folktale)
![Licence](https://img.shields.io/npm/l/folktale.svg?style=flat-square&label=licence)
![Stability: Stable](https://img.shields.io/badge/stability-stable-green.svg?style=flat-square)


Folktale is a suite of libraries for generic functional programming in
JavaScript that allows you to write elegant modular applications with fewer bugs
and more reuse.


## Installing

The officially supported way of getting Folktale is through [npm][]:

    $ npm install folktale

> **NOTE**
>
> If you don't have npm, you'll need to install [Node.js][] in your
> system before installing Folktale.

A tool like [Browserify][] or [Webpack][] can be used to run Folktale in
platforms that don't implement Node-style modules, like the Browser.

[Node.js]: https://nodejs.org/
[npm]: https://www.npmjs.com
[Browserify]: http://browserify.org/
[Webpack]: https://webpack.github.io/


## Documentation

Folktale is annotated with [Meta:Magical](https://github.com/origamitower/metamagical),
so every runtime Folktale object contains documentation annotation that you
can retrieve interactively.

Currently the only way of doing that is through the [REPL browser](https://github.com/origamitower/metamagical/tree/master/packages/repl),
however.

To look at Folktale's documentation you need to install `metamagical-interface`
and `metamagical-repl`:

```shell
npm install metamagical-interface@3.3.x
npm install metamagical-repl@0.2.x
```

Once that's taken care of, you can look at documentation by loading the `documentation`
submodule:

```js
var docs = require('folktale/documentation');  
```

`docs` is a browser pointing to the root of the Folktale library. From there
you can invoke the following methods:

  - `.forProperty(name)` — returns a new Browser for the object you can reach
    at that property in the current object. `docs.forProperty("core")` returns
    a Browser for the `core` module, for example.
    
  - `.source()` — returns the original source code of the current object. This
    is the source code before the Babel compilation pass, so it's actual,
    human-written ES6 code! — and for objects too, not only functions.
    
  - `.stability()` — returns the stability of the current object, considering
    all of the objects below it. So if an object is made out of experimental
    objects, it'll also be considered experimental.
    
  - `.documentation()` — returns the full documentation of the object. This
    is usually a huge chunk of (formatted for TTY) markdown, containing
    examples, explanations of why a feature exists, when you would use it,
    how it works under the hood, and others. The new version of Folktale
    places a heavy emphasis on documentation.
    
  - `.summary()` — returns a summary of the object. Its signature, type,
    where it's defined, a short summary of its documentation, the properties
    in the object, and some other meta-data.
  


## Supported platforms

Folktale is supported in all platforms that support ECMAScript 5.

> **NOTE**  
> For platforms that don't support ECMAScript 5, (like IE8 and 9) the
> [es5-shim][] library can be used to provide the additional runtime
> support.

[es5-shim]: https://github.com/es-shims/es5-shim


## Support

If you think you've found a bug in the project, or want to voice your
frustration about using it (maybe the documentation isn't clear enough? Maybe
it takes too much effort to use?), feel free to open a new issue in the
[Github issue tracker](https://github.com/origamitower/folktale/issues).

Pull Requests are welcome. By submitting a Pull Request you agree with releasing
your code under the MIT licence.

You can join the [Gitter Channel](https://gitter.im/folktale/discussion) for
quick support. You may also contact the author directly through
[email](mailto:queen@robotlolita.me), or
[Twitter](https://twitter.com/robotlolita).

Note that all interactions in this project are subject to Origami Tower's
[Code of Conduct](https://github.com/origamitower/folktale/blob/master/CODE_OF_CONDUCT.md).


## Licence

Folktale is copyright (c) Quildreen Motta 2015-2016, and released under the MIT licence. See the `LICENCE` file in this repository for detailed information.
