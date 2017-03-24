@guide: Can I use Folktale with Flow or TypeScript?
parent: folktale['Frequently Asked Questions']
category: Folktale and the JavaScript ecosystem
authors:
  - "@robotlolita"
---

Short answer: yes, but there are no type definitions for them currently, and some of the features in Folktale require more advanced type system concepts that they don't support.

It is possible to use Folktale with Flow and TypeScript, however some of the features Folktale relies on can't be expressed in those type systems, and so they must be described with the `any` type. This is not as useful for static checking, and it might make using some of the features more annoying or more difficult.

Better support for some of the features that Folktale uses depends on the concept of Higher-Kinded Polymorphism (very roughly: types that generalise other types. Think of generics, but instead of generalising the `x` in `List<x>`, it generalises the `List` and the `x` in `List<x>`). Right now, the status of supporting HKP in Flow is ["maybe at some point in the future"](https://github.com/facebook/flow/issues/30), meanwhile TypeScript's status is ["we like the idea, but it's a lot of effort and low priority. We're accepting PRs, though"](https://github.com/Microsoft/TypeScript/issues/1213#issuecomment-275222845), with some of the community trying to work something out. So, maybe in the future, but definitely not right now.

That said, [*basic* support for TypeScript is planned](https://github.com/origamitower/folktale/issues/65) for the initial 2.0 release. Right now you can use it if you explicitly declare the module to have the `any` type (or rely on implicit `any`, but that's even less ideal). Not great, but works. Support for Flow *might* come after that, but no guarantees.

###### Notes

- [@jongold](https://github.com/jongold) has started a project with [Flow definitions for Folktale 1](https://github.com/jongold/folktale-flow). Currently it has definitions for Data.Task.
