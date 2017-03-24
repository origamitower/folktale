@guide: How stable are the Folktale libraries?
parent: folktale['Frequently Asked Questions']
category: Folktale's stability and organisation
authors:
  - "@robotlolita"
---

Short answer: Folktale 1 packages (`folktale/data.*`) are the latest stable release. Folktale 2 (`origamitower/folktale`) is currently in *alpha*.


The [Folktale organisation](https://github.com/folktale) on GitHub hosts the libraries referred to as Folktale 1. These are split into many independent packages:

  - [core.lambda](https://www.npmjs.com/package/core.lambda)
  - [core.operators](https://www.npmjs.com/package/core.operators)
  - [data.maybe](https://www.npmjs.com/package/data.maybe)
  - [data.either](https://www.npmjs.com/package/data.either)
  - [data.validation](https://www.npmjs.com/package/data.validation)
  - [data.task](https://www.npmjs.com/package/data.task)
  - [control.monads](https://www.npmjs.com/package/control.monads)

The packages above are the most recent **stable** releases of Folktale at this moment. The Folktale organisation also hosts many other experimental packages. Those are either unfinished, untested, or known to have implementation or design problems, and shouldn't be used in production.

In an effort to improve the quality and coherence of Folktale packages, a new, monolithic package is being developed. That's referred to as Folktale 2, and lives in the [origamitower/folktale](https://github.com/origamitower/folktale) repository. It explains the [design principles behind the new library](https://github.com/origamitower/folktale/blob/master/CONTRIBUTING.md#the-design-principles-behind-folktale) and why it was moved to a monolithic repository/package.

At the moment, Folktale 2 is considered **alpha**, and should not be used in production. Aside from the lack of documentation, some of the APIs are still changing, and some features have not been implemented yet. API changes from Folktale 1 to 2 have also not been documented yet.
