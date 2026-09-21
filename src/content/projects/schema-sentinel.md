---
title: SchemaSentinel
subtitle: Catch the break before the agent does.
description: A small CLI that reads a saved tools/list file and flags two documented n8n-to-MCP schema bugs. It says where it broke and what to do about it.
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
evidenceLabel: seeded bugs found in the test files
takeaway: "I added a third answer: checked and clean, checked and broken, and could not check properly."
architecture:
  - title: Read
    detail: Turn the three JSON shapes into one list
  - title: Resolve
    detail: Follow local #/ references
  - title: Inspect
    detail: Check three documented rules
  - title: Report
    detail: Pointer to the break plus a fix
---

## The problem

An agent can only call a tool if the schema survived the trip. I kept seeing two n8n-to-MCP cases: the `$defs` block goes missing while the `$ref` stays, or a typed schema collapses into a plain object with no constraints.

The tool still shows up in the list. It just cannot run properly.

## What I built

SchemaSentinel is a TypeScript CLI. You hand it a saved `tools/list` response — the full JSON-RPC envelope, a bare result, or just the array — and it checks three narrow rules for those two bug patterns.

Each hit names the tool, gives the JSON Pointer to the exact spot, and suggests a fix. There is a human-readable report and a JSON one. Same verdict, different shape.

## Why the exit codes matter

There are three outcomes, and I kept them separate on purpose:

- **0 — no findings:** the check ran and found nothing in scope.
- **1 — findings:** the check ran and found one of the documented patterns.
- **2 — no trustworthy verdict:** the file could not be checked as supported.

The third one matters most. An external reference, a different dialect, or broken JSON is not a clean bill of health. A pipeline that treats “couldn’t check” as “passed” will ship a broken tool with a green badge.

## Evidence you can inspect

The repo’s own evaluation on 11 September 2026 says **15 out of 15 seeded bugs found**, **zero false alarms on eight clean files**, and identical reports across repeat runs. The README also mentions 136 passing tests.

Those numbers cover the bundled test files. They do not mean general MCP compliance or every possible schema bug. The fixtures, the runner, the sample reports, and the links to n8n issues #25964 and #33864 are all in the repo.

## Scope and next steps

This handles JSON Schema 2020-12 with local references. It is an offline checker, not an MCP client and not a full schema test suite.

If I add another rule, I would start from another documented failure, write both good and bad fixtures first, and spell out what it cannot see before I ship the check. More rules only help if “clean” keeps meaning something.

*Write-up based on the public repo on 15 September 2026. The test numbers are the repo’s, not a new benchmark I ran.*
