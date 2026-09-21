---
title: SchemaSentinel
subtitle: Catch the break before the agent does.
description: A focused CLI that spots documented MCP schema-conversion defects, explains the failure, and refuses to call an unsupported input a pass.
category: Developer tools
tags: [TypeScript, MCP, JSON Schema, CLI]
date: 2026-09-15
order: 2
featured: true
status: Reproducible CLI
repo: https://github.com/schatten007/SchemaSentinel
source: https://github.com/schatten007/SchemaSentinel/tree/1c222db3ee948c3cfa7e046c0d6daac74e7f03cd
visual: sentinel
accent: lavender
evidence: '15/15'
evidenceLabel: seeded defects detected in the documented corpus
takeaway: A trustworthy tool knows the difference between “clean” and “I can’t tell.”
architecture:
  - title: Read
    detail: Normalize a tools/list JSON file
  - title: Resolve
    detail: Follow supported local references
  - title: Inspect
    detail: Apply three evidence-backed rules
  - title: Report
    detail: Stable pointers + actionable fixes
---

## The problem

An AI agent can only call a tool reliably if its schema survives the trip between systems. Documented n8n-to-MCP conversion defects show two ways that can go wrong: a `$defs` block can disappear while its `$ref` survives, or a typed schema can collapse into an unconstrained object.

A tool can still look present while its input contract is broken.

## What I built

SchemaSentinel is a TypeScript CLI that reads a saved `tools/list` response and checks three narrowly defined rules across those two defect families. It accepts the JSON-RPC envelope, a bare result object, or a bare tool array, then normalizes reporting to a stable document shape.

Each finding names the tool, points to the original location with a JSON Pointer, and includes a remediation line. Human-readable and machine-readable outputs serve different workflows without changing the underlying verdict.

## Why the exit codes matter

The CLI distinguishes three outcomes:

- **0 — no findings:** validation completed within the supported boundary.
- **1 — findings:** validation completed and found a documented fingerprint.
- **2 — no trustworthy verdict:** the input could not be checked as supported.

That third result matters. An external reference, unsupported dialect, or invalid input is not evidence of a clean schema. A pipeline should not mistake “the tool couldn't inspect this” for “the tool inspected it and found nothing.”

## Evidence you can inspect

The repository reports **15 of 15 seeded defects detected**, **zero false positives across eight valid controls**, and byte-identical reports across consecutive evaluation runs. Its documented evaluation is dated 11 September 2026; the README also reports 136 passing tests.

Those figures describe the bundled corpus. They do not establish general MCP compliance or detection of every possible schema defect. The fixtures, evaluation harness, sample reports, and defect provenance are available with the code.

## Scope and next steps

The supported dialect is JSON Schema 2020-12, with local JSON Pointer references. This is an offline linter, rather than an MCP client or a general JSON Schema conformance suite.

An appropriate extension would start with another documented failure, add both positive and negative fixtures, and define its boundary before introducing a new rule. More checks are useful only if they preserve the distinction between corruption and intentional permissiveness.

*Case study based on the public repository snapshot from 15 September 2026. Evaluation figures are repository-reported, not a new independent benchmark.*
