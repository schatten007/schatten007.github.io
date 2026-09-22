---
title: Why the checker needs an exit 2
description: What should a validator return when it cannot inspect the input? SchemaSentinel keeps that separate from a pass.
category: Agent tooling
date: 2026-09-21
readingTime: 3 min
relatedProject: schema-sentinel
---

Suppose a schema refers to `shared.json`, but the checker only understands references within the current document. Should the check pass?

It hasn’t found a broken reference. It also hasn’t followed the reference. Returning success would hide that difference from the next step in the pipeline.

## Three outcomes

SchemaSentinel uses three exit codes:

```text
0  check completed, no findings
1  check completed, findings
2  no trustworthy verdict
```

That last case covers inputs outside the supported dialect and reference rules, as well as input errors. It tells the caller that there is no result to rely on.

The external-file example gets exit 2. A local reference with a missing target gets exit 1. Restore the target, and that particular reference check can complete without a finding.

## A log warning is easy to miss

Many scripts make decisions from the process status alone. A sentence in the logs saying “couldn’t follow this reference” is little help if the command still exits successfully.

Putting the distinction in the exit code lets the caller decide what happens next. It might stop the job, ask for a self-contained schema, or use a checker with broader support.

## What a pass actually means

For this tool, “no findings” means the supported checks completed without finding one of the documented defect patterns. It doesn’t certify every aspect of the schema or its MCP integration.

That wording is less dramatic than “valid”, but it tells the next engineer what was checked. You can try the three cases in the [schema lab](/lab/#schema-bench).

Source: [SchemaSentinel’s supported boundaries and exit codes](https://github.com/schatten007/SchemaSentinel/tree/1c222db3ee948c3cfa7e046c0d6daac74e7f03cd).
