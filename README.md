Folkale
=======

[![Documentation status](https://readthedocs.org/projects/folktale/badge/?version=latest&style=flat-square)](https://docs.folktalejs.org/)
[![Build status](https://img.shields.io/travis/folktale/folktale/master.svg?style=flat-square)](https://travis-ci.org/folktale/folktale)
[![NPM version](https://img.shields.io/npm/v/folktale.svg?style=flat-square)](https://npmjs.org/package/folktale)
[![Dependencies status](https://img.shields.io/david/folktale/folktale.svg?style=flat-square)](https://david-dm.org/folktale/folktale)
![Licence](https://img.shields.io/npm/l/folktale.svg?style=flat-square&label=licence)
![Stability: Stable](https://img.shields.io/badge/stability-stable-green.svg?style=flat-square)

Folktale is a suite of libraries for generic functional programming in
JavaScript that allows you to write elegant modular applications with fewer bugs
and more reuse.

This package provides a consistent *prelude* / *standard library* for JavaScript
based on that philosophy, by bringing together many individual modules in the
Folktale project.

## Installing

You can grab the latest release from npm:

    $ npm install folktale


## Documentation

You can read the documentation online at http://docs.folktalejs.org/. You can
also build the documentation locally with [Sphinx][]:

    $ git clone git://github.com/folktale/folktale.git
    $ cd folktale
    $ npm install
    $ make documentation

## Platform support

This library assumes an ES5 environment, but can be easily supported in ES3
platforms by the use of shims. Just include [es5-shim][] :)


## Licence

Copyright (c) 2015 Quildreen Motta.

Released under the [MIT licence](https://github.com/folktale/folktale/blob/master/LICENCE).

<!-- links -->
[es5-shim]: https://github.com/kriskowal/es5-shim
[Sphinx]: http://sphinx-doc.org/
