---
title: Known issues
prev_doc: v2.1.0/changelog
next_doc: v2.1.0/migrating
---

  - [`union(typeId, patterns)` fails in Node 5.x](https://github.com/origamitower/folktale/issues/47) (v8 4.6.85.x) due to a bug in the optimising compiler. This bug has since been fixed (Node 6+ versions are okay), and does not affect older v8 versions (Node 4.x is also okay).

