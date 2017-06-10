---
title: Stability index
next_doc: v2.0.0/misc/design-principles
---


Each API in Folktale is marked with a particular "stability index". They
describe what you can expect from that API in the future releases of the
library, so you can decide whether it's safe for you to use it or not
in a particular project.

The stability index is based on [Node.js's stability index](https://nodejs.org/api/documentation.html#documentation_stability_index).

## Contents
{:.no_toc}

* TOC
{:toc}


## Deprecated

The feature is problematic in some way, and will either be entirely
removed from the system, or completely redesigned.

Features that are deprecated will not be shipped in the next major
version of Folktale, however it'll still be available in any minor
or feature release. For example, `Maybe#get` was deprecated in
Folktale 2.0, which means that it'll be available until the Folktale
3.0 release.

When a feature is deprecated, warnings will be displayed in the
standard output whenever something uses it. These warnings will
also contain the location where these features are used. Note that,
since the warnings use the current stack trace, [this might not be entirely accurate if running in an engine with PTC enabled](https://github.com/tc39/proposal-ptc-syntax#errorstack).


Deprecated features will list the reason for deprecating them in
this documentation, along with any new APIs that have been designed
to replace them. Code using deprecated APIs should migrate to new 
APIs as soon as possible.


## Experimental

The feature has not been tested enough to be considered stable yet,
and is included in a particular release so people can test and see
where its weak points are.

Note that experimental features are subject to change **at any point** in
future releases. This means that if a feature is released as
experimental in 2.0, it could be changed, or even removed, in
a 2.1 release.

Experimental features should not be relied upon.


## Stable

The feature is stable, and its API is unlikely to change, unless deemed
necessary for security or other important reasons. Backwards compatibility
will always be maintained in the next major release.

A feature becomes stable once it has seen enough tests or proof that
the API is a good solution for the particular problem it tries to solve.


## Locked

The feature will not change in any future release, although security patches
and bug fixes may still be applied.

Even if a locked feature is deprecated, it will *not* be removed from Folktale,
in any future release.