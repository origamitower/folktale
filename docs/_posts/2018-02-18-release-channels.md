---
layout: blog
title:  "Using release channels in a better way"
group:  blog
---

Hello~

When Folktale 2 was released last year two release channels were defined:

  - `latest` for the stable and tested versions;
  - `next` for the stable, but not tested versions;

But now: where do we put experimental branches (like the TypeScript typings one)
and limited test releases so users can check if problems are fixed before we merge
a PR? There wasn't really a place for them, and this led to some mess in the releases.

So, from now on, Folktale will be using temporary channels for these cases. A
temporary channel is a sequence of releases associated with a tag that we expect
to either merge back into the master (so it becomes a `next` release), or die.
These tags will likely end up being similar to the name of the branch in the PR,
but shorter.

The TypeScript typings experimental branch (`feat/typescript-typings`) will be the first
to use this scheme, using the tag `tstypes`.