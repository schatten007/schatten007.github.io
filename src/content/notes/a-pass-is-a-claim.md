---
title: A pass is a claim. Make it a precise one.
description: Why I gave SchemaSentinel an exit code for “couldn’t check properly”.
category: Agent tooling
date: 2026-09-21
readingTime: 3 min
relatedProject: schema-sentinel
---

I used to read a green check as good news. Then I watched a schema pass a check the tool could not actually run, and the agent failed later with a worse error.

That is what exit 2 is for in SchemaSentinel.

## Three outcomes, not two

Zero means I looked and found nothing in scope. One means I looked and found one of the documented patterns. Two means I could not look properly — wrong dialect, external file, broken JSON.

The external-file case is the one I kept getting wrong. My checker only follows local `#/` references. If a schema points to `shared.json`, I cannot say if that file is fine. Returning zero would turn “I didn’t look” into “looks good”.

So it returns two and says so:

```text
0  I checked, nothing in scope
1  I checked, found something
2  I couldn’t check properly
```

“No findings” describes what I did. “Valid” would promise more than I checked.

## Keep “don’t know” in the status code

A warning in a log does not help if the pipeline only reads the exit code. I have seen this in other places too. A missing field is not the same as an unreadable document. No search hits is not the same as a dead index. An unhealthy service is not the same as a failed probe.

If those share one code, debugging starts with guessing which one it was.

## The boundary is part of the tool

SchemaSentinel only handles JSON Schema 2020-12 with local references, and only three documented patterns. The test numbers make sense inside that box. Outside it, exit 2 is the honest answer.

**What I do now:** before I add a green check anywhere, I write the one sentence it is allowed to mean.

Source: [SchemaSentinel’s boundaries and exit codes](https://github.com/schatten007/SchemaSentinel/tree/1c222db3ee948c3cfa7e046c0d6daac74e7f03cd).
