# Change log

User-facing changes to the Folktale project are summarised here, ordered from the most recent releases to the oldest ones.

Each version entry is written as a heading in the format `[<version number>] - YYYY-MM-DD` and contains the sections:

  - **New features** — Functionality that has been added from the previous version to the referred one;
  - **Bug fixes** — Incorrect behaviour that has been corrected from the previous version to the referred one;
  - **Optimisations** — Performance and memory improvements from the previous version to the referred one;
  - **Documentation** — Improvements made to the documentation;
  - **Miscellaneous** — Any other change worth mentioning that doesn't fall in the previous ones;
  - **DEPRECATED FEATURES** — Features that have been deprecated in the referred version, and should be avoided for new codebases;
  - **BREAKING CHANGES** — Backwards-incompatible changes that have been introduced by the version, along with the changes necessary to existing codebases. Upgrading from previous versions is not safe;


---

## [Unreleased]


## [2.0.0-alpha3] - 2017-03-11

### New features

  - Adds a `nullable → maybe` conversion
    ([9706ab7](https://github.com/origamitower/folktale/commit/9706ab79e453473e2c29c9d00054d81f09c584f1));
  - Adds a `.fold()` method to the `Maybe` structure. This works similarly to Result and Validation's `.fold()` method, except the function for the `Nothing` case takes no arguments
    ([6f59f61](https://github.com/origamitower/folktale/commit/6f59f615c0ac4f09ccef51717eb09b6c669299a6));
  - Adds the `collect` function (`data/validation/collect`), which makes aggregating errors from failures directly a bit simpler
    ([#71](https://github.com/origamitower/folktale/issues/71), [a677e96](https://github.com/origamitower/folktale/commit/a677e967e4e1cf9f68a5503d5a49d802a3b9ce6a));


### Bug fixes

  - Fixes the exported symbol for `validation → either` conversion
    ([450cb70](https://github.com/origamitower/folktale/commit/450cb70561605c3c6ec23b0c1f8490f8b9852d8c));
  - Fixes the Setoid implementation to work with the `core/fantasy-land` module
    ([d761107](https://github.com/origamitower/folktale/commit/d761107a0f7847b3ae23800c3806cde0133a3e84));
  - Fixes a bunch of currying and argument order issues with the `core/fantasy-land` module
    ([d5b0c74](https://github.com/origamitower/folktale/commit/d5b0c7436717db442d3412b520e33339d9ad4002));


### Miscellaneous

  - Annotated files are now only generated for testing and documentation, which makes browser bundles much smaller
    ([e0186fa](https://github.com/origamitower/folktale/commit/e0186fa3779b98c5760fed0bc7546bbf6356ea4f));


### DEPRECATED FEATURES

  - The old `.get()` methods are deprecated in favour of the new `.unsafeGet()` methods. There was no behavioural change, just a naming one. See [#42](https://github.com/origamitower/folktale/issues/42).
    ([278d5a7](https://github.com/origamitower/folktale/commit/278d5a7a0fb612bb47501688dfebd6c79d92e0e8), [19910b4](https://github.com/origamitower/folktale/commit/19910b4a321e1e2a4c597c2aac429e26a7dda4bc));



### BREAKING CHANGES

  - ([8e1b27e](https://github.com/origamitower/folktale/commit/8e1b27e2d2e282f49cc5fa08ce1069df7aed59ca))
    Modules that were previously named `core.js` now reflect the name of the functionality they implement. This affects you if you've been importing the `core.js` modules directly, rather than their folder. The following modules are affected by this change:

      - `core/adt/core.js` → `core/adt/data.js` (exports the `data` function);
      - `data/either/core.js` → `data/either/either.js` (exports the `either` ADT);
      - `data/maybe/core.js` → `data/maybe/maybe.js` (exports the `maybe` ADT);
      - `data/validation/core.js` → `data/validation/validation.js` (exports the `validation` ADT).


  - ([7a1ef33](https://github.com/origamitower/folktale/commit/7a1ef333566ae915e188bc6b16059e3be4d36aed))
    Removes the `data/either/fromNullable.js` module, which was moved to the `data/conversions` module. This affects you if you have been importing that module directly. In that case you can import `data/conversions/nullable-to-either.js` instead:

    ```js
    // Before
    const eitherFromNullable = require('data/either/fromNullable');

    // Now
    const eitherFromNullable = require('data/conversions/nullable-to-either');
    ```

    Note that no changes are necessary if you were importing the whole `data/either` module and taking the `fromNullable` method from there.


  - ([5676d39](https://github.com/origamitower/folktale/commit/5676d39238e821925eb292e47d3328c429ff07e7))
    `Either.try` now takes a thunk, rather than being a curried-ish form of application:

    ```js
    // Before
    Either.try((a) => a.foo())(null);   // ==> Left("cannot read property 'foo' of null")
    
    // Now
    Either.try(() => null.foo());       // ==> Left("cannot read property 'foo' of null")
    ```

  - ([PR #62](https://github.com/origamitower/folktale/pull/62))
    Renames `Either` → `Result`. No behaviour changes, but a bunch of terminology changes that break existing code.

    Where one used to write:

    ```js
    const { Left, Right } = require('folktale/data/either');
    ```

    One would now write:

    ```js
    const { Error, Ok } = require('folktale/data/result');
    ```

    The data structure's name has been changed to Result. The `Left` case has been changed to `Error`, and the `Right` case has been changed to `Ok`. This affects all uses of `.matchWith` as well as constructing values.  


  - ([d5e780f](https://github.com/origamitower/folktale/commit/d5e780f4f4264713d476a74fa4d5c248a266b4d5))
    Remove the `.cata()` method from `core/adt`, but adds it to Maybe and Validation. This breaks any `core/adt` structure that was using `.cata()` instead of `.matchWith()`, but makes it easier for people to migrate their code with Maybe and Validation to Folktale 2 by just replacing `require('data.maybe')` with `require('folktale/data/maybe')`.


  - ([f0dd120](https://github.com/origamitower/folktale/commit/f0dd12069877ecdfb9f3f8bd0680a6ad668190a5))
    Several renamings to make the API consistent regarding its usage of English (see [#21](https://github.com/origamitower/folktale/issues/21)), so now all names in the API use US English spelling, although the documentation still uses British English spelling:

      - The `Show` derivation (`core/adt/show.js`) is now called `DebugRepresentation` (`core/adt/derivations/debug-representation.js`);
      - The `Setoid` derivation (`core/adt/setoid.js`) is now called `Equality` (`core/adt/derivations/equality.js`). The method for providing a custom comparison function, previously `.withEquality(cmp)` is now called `.wthCustomComparison(cmp)`;
      - The `Serialize` derivation (`core/adt/serialize.js`) is now called `Serialization` (`core/adt/derivations/serialization.js`);
      - The derivations are now provided in the `core/adt/derivations.js` file, and consequently in a `derivations` property of the `core/adt` module, rather than directly there;
      - The `partialise` function (`core/lambda/partialise.js`) is now called `partialize` (`core/lambda/partialize.js`).


## [2.0.0-alpha2] - 2016-12-05

### New features

  - Adds the `Show` derivation for ADTs, which provides `.toString()` and `.inspect()` methods, as well as the internal `ToStringTag` symbol ([PR #12](https://github.com/origamitower/folktale/pull/12) by @boris-marinov);
  - Adds the `partialise` function to the `core/lambda` module. Partialise allows one to pass "holes" into a function application in order to specify only part of the arguments. It's similar to `curry` in that it supports partial application, but it works better with regular JavaScript functions since argument saturation is explicitly defined, rather than depending on the number of arguments provided;
  - Adds the `Serialize` derivation for ADTs, which provides `.toJSON()` and `.fromJSON(value)` methods ([PR #15](https://github.com/origamitower/folktale/pull/15) by @boris-marinov);
  - Adds the `data/validation` module, with equivalent semantics to the older Data.Validation structure. The breaking changes described in the previous version for Either and Maybe apply to this structure as well ([PR #22](https://github.com/origamitower/folktale/pull/22) by @boris-marinov);
  - Adds the `data/conversions` module, supporting conversions between nullable types, maybes, eithers, and validations. Some of these are also provided in each structure itself as convenience methods ([PR #24](https://github.com/origamitower/folktale/pull/24) by @boris-marinov);
  - Adds the `core/fantasy-land` module, containing free functions for each Fantasy Land specification method. This allows codebases to interact seamlessly with code for older and newer Fantasy Land specifications ([PR #37](https://github.com/origamitower/folktale/pull/37) by @boris-marinov, [PR #43](https://github.com/origamitower/folktale/pull/43));
  - Adds the `data/task` module, with a new Task implementation ([PR #50](https://github.com/origamitower/folktale/pull/50)).

### Bug fixes

  - Changes the `.hasInstance(value)` method in ADTs so it supports testing non-objects as well. Previously this method would fail when testing `null` and `undefined` values;

### DEPRECATED FEATURES

  - The `.cata(pattern)` method is now deprecated in favour of the new `.matchWith(pattern)` method. They have the same behaviour;
  - The `.is{TAG}` fields are deprecated in favour of the new `.hasInstance(value)` methods. The `.hasInstance()` versions allow safely testing any value, even non-objects, and also do an union instance checking, rather than a simple tag check;


## [2.0.0-alpha1] - 2016-05-09

This is the initial release of the redesigned Folktale. Backwards compatibility with Folktale 1 was not provided.

### New features

  - Adds `core/adt` module to allow constructing union types in an easier way ([PR #11](https://github.com/origamitower/folktale/pull/11));
  - Adds the `Setoid` derivation for ADTs, which provides an `.equals()` method ([PR #10](https://github.com/origamitower/folktale/pull/10) by @boris-marinov);
  - Adds the `core/lambda` module with `compose`, `constant`, `identity`, and `curry`. The new `curry` implementation only unrolls application for functions marked by Folktale as constructed by `curry`, avoiding [some of the problems with composing curried and regular functions](https://github.com/origamitower/folktale/blob/master/FAQ.md#why-do-i-get-an-error-saying-apply-is-not-a-function);
  - Adds the `core/object` module with `fromPairs`, `mapEntries`, `mapValues`, `toPairs`, and `values`;
  - Adds the `data/maybe` module, with equivalent semantics to the older Data.Maybe structure;
  - Adds the `data/either` module, with equivalent semantics to the older Data.Either structure.

### BREAKING CHANGES

  - `Either` and `Maybe`'s `.cata()` method now passes the whole instance instead of just the value:

    ```js
    // Before
    Either.Right(1).cata({
      Left: (value) => value + 1,
      Right: (value) => value - 1
    });
    // ==> 0

    // Now
    Either.Right(1).cata({
      Left: (leftInstance) => leftInstance.value + 1,
      Right: (rightInstance) => rightInstance.value - 1
    });
    // ==> 0
    ```

    Using ES2015's destructuring assignments:

    ```js
    Either.Right(1).cata({
      Left: ({ value }) => value + 1,
      Right: ({ value }) => value - 1
    });
    // ==> 0
    ```