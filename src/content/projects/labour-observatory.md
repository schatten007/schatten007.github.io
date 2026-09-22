---
title: EU Tech Labour Observatory
subtitle: Public job-posting data, with the collection rules kept visible.
description: A collection pipeline and dashboard for Swedish and German tech-job postings. The two source scopes are kept separate.
category: Data systems
tags: [Python, DuckDB, dbt, React]
date: 2026-09-06
order: 3
featured: true
status: Public data project
repo: https://github.com/schatten007/EU-Tech-Labor-Observatory
source: https://github.com/schatten007/EU-Tech-Labor-Observatory/tree/8ca23914700c199c90e8b39ba2fc4e25475eff95
visual: observatory
accent: peach
evidence: '02'
evidenceLabel: sources shown separately, never ranked together
takeaway: Sometimes the honest chart is the one that says “this source doesn’t have that field.”
architecture:
  - title: Collect
    detail: Save each sweep without overwriting
  - title: Enrich
    detail: Map places and skills to pinned lists
  - title: Sanitize
    detail: Keep only allowed fields, hash the IDs
  - title: Publish
    detail: Same numbers in an app and a plain page
---

## The problem

Job ads look like data, but a chart can promise more than the source has. A keyword search is not a census. A regional sample is not a national total. And two countries collected differently should not share one ranking.

The Observatory publishes the collected counts with those limits beside them.

## What I built

The project watches two public sources separately: JobTech in Sweden (keyword search) and BA Jobsuche in Germany (a fixed panel of 400 NUTS-3 regions, sampled with a cap). Each sweep is stored as-is, so a posting that disappears shows up as an event instead of vanishing.

Structured fields get mapped to pinned references: NUTS-2024, JobTech Taxonomy v30, ESCO 1.2.1. Then a sanitize step keeps only allowed fields and pseudonymizes native IDs with a versioned HMAC. DuckDB and dbt handle the transformations with column contracts.

The same checked export feeds two pages: a React dashboard called Job Market Pulse, and a single HTML file you can read with JavaScript off. The dashboard never computes its own numbers. If a figure is not in the export, it is not on screen.

## The interesting engineering decision

The frontend is a **display, not a calculator**.

The German source has no occupation field. So the German occupation panel says it is unavailable instead of guessing from job titles. Guessing would mean shipping a classifier with its own error rate inside a product that otherwise reports what sources said. That is a different feature.

The Swedish and German scopes stay separate in the analysis. Their different collection rules do not support a combined cross-country ranking.

## Evidence you can inspect

The repo has the collectors, the pinned crosswalks, a synthetic sample, the mapping evaluation, dbt contracts, app screenshots, and a committed copy of the analytical page. The README lists an offline gate: lint, type checks, 63 Python tests, mapping evaluation, and 190 dbt resources.

I am not presenting old posting counts as a live market feed here. The drawing on this site is simplified, not live data.

## Scope and next steps

Sweden is keyword-scoped, so it misses anything outside those queries. Germany is a capped draw across the fixed panel, so its counts describe that design, not national totals. There is no education field in either source, so there is no education chart.

The repository includes a proposed usability study: can a reader identify the source, denominator, and limitation of a chart? The documented snapshot does not include results from that study. Running it would be a useful next evaluation.

*Write-up based on the public repo on 6 September 2026. Counts and methodology version are the repo’s, from that date.*
