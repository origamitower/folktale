@guide: Navigating the issue tracker
category: 4. Annexes
authors:
  - "@robotlolita"
---

Describes how the issue/feature tracker is organised.

* * *

Ideas and bugs live in the [Github Issue tracker](https://github.com/origamitower/folktale/issues), and can be
visualised as a Kanban board in [Waffle.io](waffle.io/origamitower/folktale).
If you're not sure where to start, there's a selection of [good first
issues](https://waffle.io/origamitower/folktale?label=e:Good%20First%20Issue)
which you may want to try.

All tasks are categorised in terms of the kind of work, its scope, its
effort, its status, and its priority. 

Here's what the labels mean:

  - `c:*` — The **category** labels classify the scope of the issue.
  - `e:*` — The **effort** labels define how much effort resolving a particular
    issue is likely to take.
  - `p:*` — The **priority** labels define how urgent resolving a particular
    issue is.

Kind labels:

  - `k:Enhancement` — The task refers to something that improves the Folktale
    library, such as adding new features or making existing features easier
    to use.
  - `k:Error` — The task refers to a problem with the Folktale library. We
    consider problems not only bugs, but things like missing documentation and
    confusing behaviour.
  - `k:Optimisation` — The task doesn't change anything about the behaviour of
    Folktale, but it improves the performance of some of its components.
  - `k:Discussion` — Discussions about features that don't fit any of the
    kinds above.

Status labels:

  - `s:Duplicate` — The issue is already covered by a separate issue, and
    should be discussed there.
  - `s:Invalid` — The issue is not a problem in Folktale.
  - `s:Won't Fix` — The issue does not fit Folktale's philosophy.

All triaged issues will at least contain a `category` label and a `kind` label.