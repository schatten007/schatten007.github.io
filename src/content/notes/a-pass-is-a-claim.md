---
title: A pass is a claim. Make it a precise one.
description: Why a validator needs a third outcome between success and failure, and why your automation should care.
category: Agent tooling
date: 2026-09-21
readingTime: 3 min
relatedProject: schema-sentinel
---

A green check is a small user interface with a large implied promise. Most people read it as “this is good.” Most validators can only establish “these checks found nothing in the part I understood.”

The distance between those statements is where brittle automation starts.

## Three outcomes, not two

SchemaSentinel gives its CLI three distinct exit codes. Zero means inspection completed without findings. One means inspection completed with findings. Two means it could not produce a trustworthy verdict.

Consider a schema with a reference to an external file. An offline tool that only follows local JSON Pointers cannot establish whether that external definition exists. Ignoring it and returning zero would turn an unsupported feature into an apparent success.

Instead, the tool refuses the verdict:

```text
0  checked, no findings
1  checked, findings
2  not checked reliably
```

The words matter as much as the numbers. “No findings” names the observation. “Valid” may promise something the tool never checked.

## Keep uncertainty machine-readable

A warning in a log is not sufficient if the consuming pipeline only checks the process status. The uncertainty needs to travel through the same channel as the decision.

This pattern applies beyond schema linting. An extraction workflow can distinguish a missing field from an unreadable document. A retrieval system can distinguish no matching evidence from an unavailable index. A deployment check can distinguish an unhealthy service from a failed probe.

Collapsing those states makes the calling system simpler in the short term and harder to debug later.

## The boundary is part of the interface

A useful tool tells you what it can inspect, what it observed, and what it could not establish. That is not a footnote to the API. It is part of the contract.

SchemaSentinel deliberately limits itself to documented defect fingerprints in JSON Schema 2020-12 with supported local references. Its evaluation results make sense inside that boundary. They are not a general certificate of MCP compliance.

**Practical rule:** before adding another green check, write the exact sentence that check is allowed to mean.

Source: [SchemaSentinel's supported boundaries and exit codes](https://github.com/schatten007/SchemaSentinel/tree/1c222db3ee948c3cfa7e046c0d6daac74e7f03cd).
