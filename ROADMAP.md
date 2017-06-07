# Folktale Roadmap

This file contains the planned features and vision for the future versions of Folktale. Note that here we only provide an overview of the features. Once they're fleshed out they'll be created as issues in the GitHub issue tracker, which helps tracking progress on them.


## 3.0

With this Folktale should be a solid, cross-platform base library for JS/TS applications.


  - **Move to TypeScript**.

  - **Applicative Tasks**.

  - **Missing algebras for existing structures**.
    These algebras are described in the FAQ. Some of them still require thinking about which behaviour to implement.

  - **Use less broad categories for the subpackages**.
    - `Core`: (Maybe, Result, Validation, Lambda, Object, FantasyLand, ADT)
    - `Concurrency`: (Task, Future, Channel, Stream)
    - etc.

  - **A numeric tower with promotion, like in Scheme** (`Numeric`).
    - `Integral`, for arbitrary-precision integers.
    - `Decimal`, for arbitrary-precision decimals.
    - `Rational`, for fractions.

  - **Common collection structures** (`Collection`).
    - `Range`, a lazy container of numbers.
    - `List`, singly-linked list.
    - `Vector`, dynamic-growing persistent vectors.
    - `Set`, persistent sets.
    - `Map`, persistent maps.

  - **More concurrent structures** (`Concurrency`).
    - `Channel`, CSP channels, based on Clojure's.
    - `Stream`, discrete asynchronous streams, based on the Observable specification.

  - **Higher-order contracts** (`Contract` or `Validation`).
    This was previously core.check, though that only had experimental support for first-order contracts.

  - **Operations for using monadic structures for control-flow** (`Control`)
    Previously `control.monads`.


## 4.0

Bring safety to OS/file system services.


  - **A wrapper over Node's file system API**.
    Move IO to CSP channels and other things to Task.

  - **A wrapper over Node's child_process API**.
    Move IO to CSP channels.


## 5.0

Bring safety to web servers/applications.

  - **A safe alternative to express** (take inspiration from Yesod)

  - **GLL parser combinators**

  - **ER models with automatic migration**
    Needs to figure out how non-relational/etc databases would fit here.

  - **HTTP client**

  