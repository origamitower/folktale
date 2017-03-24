@guide: Do Folktale structures implement Fantasy Land?
parent: folktale['Frequently Asked Questions']
category: Folktale and the JavaScript ecosystem
authors:
  - "@robotlolita"
---

Short answer: yes. Folktale 1 implements fantasy-land@1.x, and Folktale 2 implements fantasy-land@1.x up to fantasy-land@3.x, wherever possible.

Refer to the table below for implemented algebras:

### Folktale 1

Folktale 1 implements only the non-prefixed methods of Fantasy Land v0.x~1.x.


|                     | **Maybe** | **Either** | **Validation** | **Task**  |
| ------------------- | :-------: | :--------: | :------------: | :-------: |
| [Setoid][]          | ❌         | ❌         | ❌              | 🚫         |
| [Semigroup][]       | ❌         | ✅          | ❌              | ✅¹        |
| [Monoid][]          | 🚫²        | 🚫²        | 🚫²            | ✅¹        |
| [Functor][]         | ✅         | ✅          | ✅              | ✅         |
| [Contravariant][]   | 🚫        | 🚫         | 🚫             | 🚫         | 
| [Apply][]           | ✅         | ✅          | ✅              | ✅         |
| [Applicative][]     | ✅         | ✅          | ✅              | ✅3        |
| [Alt][]             | ❌         | ❌          | ❌             | ❌         |
| [Plus][]            | ❌         | ❌          | ❌             | ❌         |
| [Alternative][]     | ❌         | ❌          | ❌             | ❌         |
| [Foldable][]        | ❌         | ❌          | ❌             | ❌         |
| [Traversable][]     | ❌         | ❌          | ❌             | ❌         |
| [Chain][]           | ✅         | ✅          | 🚫⁴             | ✅         |
| [ChainRec][]        | ❌         | ❌          | 🚫⁴            | ❌        |
| [Monad][]           | ✅         | ✅          | 🚫⁴            | ✅         |
| [Extend][]          | 🚫⁵       | 🚫⁵        | 🚫⁵            | 🚫⁵        |
| [Comonad][]         | 🚫⁵       | 🚫⁵        | 🚫⁵            | 🚫⁵        |
| [Bifunctor][]       | 🚫⁶       | ✅          | ✅              | ✅         |
| [Profunctor][]      | 🚫        | 🚫         | 🚫             | 🚫        |

### Folktale 2

Folktale 2 implements *both* unprefixed and prefixed methods, and thus supports Fantasy Land v0.x~3.x.

> **NOTE**  
> The structures implement the old version of `.ap` (`fn.ap(value)`), and the new version of `."fantasy-land/ap"` (`value['fantasy-land/ap'](fn)`). Fantasy Land actually made this breaking change without bumping the major version first. If some library expects the unprefixed method to implement the new argument order, things won't work nicely.

|                     | **Maybe** | **Result** | **Validation** | **Task**  | **Future** |
| ------------------- | :-------: | :--------: | :------------: | :-------: | :--------: |
| [Setoid][]          | ✅         | ✅         | ✅              | 🚫         | 🚫          |
| [Semigroup][]       | 🔜         | 🔜         | ✅              | ❌        | ❌          |
| [Monoid][]          | 🚫²        | 🚫²        | 🚫²            | ❌        | ❌          |
| [Functor][]         | ✅         | ✅          | ✅              | ✅         | ✅          |
| [Contravariant][]   | 🚫        | 🚫         | 🚫             | 🚫         | 🚫         |
| [Apply][]           | ✅         | ✅          | ✅              | ✅         | ✅          |
| [Applicative][]     | ✅         | ✅          | ✅              | ✅         | ✅          |
| [Alt][]             | 🔜         | 🔜         | 🔜             | 🔜        | 🔜        |
| [Plus][]            | 🔜         | 🔜         | 🔜             | 🔜        | 🔜        |
| [Alternative][]     | 🔜         | 🔜         | 🔜             | 🔜        | 🔜        |
| [Foldable][]        | ❌         | ❌          | ❌             | ❌         | ❌         |
| [Traversable][]     | ❌         | ❌          | ❌             | ❌         | ❌         |
| [Chain][]           | ✅         | ✅          | 🚫⁴             | ✅         | ✅         |
| [ChainRec][]        | 🔜         | 🔜          | 🚫⁴            | 🔜        | 🔜         |
| [Monad][]           | ✅         | ✅          | 🚫⁴            | ✅         | ✅          |
| [Extend][]          | 🚫⁵       | 🚫⁵        | 🚫⁵            | 🚫⁵        | 🚫⁵         |
| [Comonad][]         | 🚫⁵       | 🚫⁵        | 🚫⁵            | 🚫⁵        | 🚫⁵         |
| [Bifunctor][]       | 🚫⁶       | ✅          | ✅              | ✅         | ✅          |
| [Profunctor][]      | 🚫        | 🚫         | 🚫             | 🚫        | 🚫          |


> **NOTES**  
> - ✅: The algebra is implemented for this structure;
> - ❌: The algebra is not implemented for this structure;
> - 🚫: The algebra can't be implemented for this structure;
> - 🔜: The algebra will be implemented for this structure in the future.
>
> ---
>
> - ¹: The Task instance of Monoid is non-deterministic, and the equivalent of Promise.race.
> - ²: Implementing a generic Monoid would require return-type polymorphism. It's theoretically possible, but not practically possible (requires free monoids and late reifying). See https://eighty-twenty.org/2015/01/25/monads-in-dynamically-typed-languages for a detailed explanation.
> - ³: Resolves Tasks in parallel, so may be observably different than the Monad instance if the ordering of effects matters.
> - ⁴: See [Why is there no `.chain`/Monad for Validation?](#why-is-there-no-chainmonad-for-validation) in this document.
> - ⁵: It's not possible to implement these without being partial, so we choose to not implement it.
> - ⁶: One side of the Maybe is nullary, and Bifunctor requires two unary functions.
 

[Monad]: https://github.com/fantasyland/fantasy-land#monad
[Applicative]: https://github.com/fantasyland/fantasy-land#applicative
[Setoid]: https://github.com/fantasyland/fantasy-land#setoid
[Semigroup]: https://github.com/fantasyland/fantasy-land#semigroup
[Monoid]: https://github.com/fantasyland/fantasy-land#monoid
[Functor]: https://github.com/fantasyland/fantasy-land#functor
[Contravariant]: https://github.com/fantasyland/fantasy-land#contravariant
[Apply]: https://github.com/fantasyland/fantasy-land#apply
[Alt]: https://github.com/fantasyland/fantasy-land#alt
[Plus]: https://github.com/fantasyland/fantasy-land#plus
[Alternative]: https://github.com/fantasyland/fantasy-land#alternative
[Foldable]: https://github.com/fantasyland/fantasy-land#foldable
[Traversable]: https://github.com/fantasyland/fantasy-land#traversable
[Chain]: https://github.com/fantasyland/fantasy-land#chain
[ChainRec]: https://github.com/fantasyland/fantasy-land#chainrec
[Extend]: https://github.com/fantasyland/fantasy-land#extend
[Comonad]: https://github.com/fantasyland/fantasy-land#comonad
[Bifunctor]: https://github.com/fantasyland/fantasy-land#bifunctor
[Profunctor]: https://github.com/fantasyland/fantasy-land#profunctor