---
title: EU Tech Labour Observatory
subtitle: A clearer signal from a noisy job market.
description: A reproducible pipeline and dashboard for public tech-job demand. Source scopes stay separate, missing data stays visible, and every ranking keeps its denominator.
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
evidenceLabel: source scopes, kept deliberately separate
takeaway: The most useful thing a dashboard can say is sometimes “this source doesn’t tell us.”
architecture:
  - title: Collect
    detail: Append-only source sweeps
  - title: Enrich
    detail: Pinned geography + taxonomy maps
  - title: Sanitize
    detail: Allowlisted, pseudonymized fields
  - title: Publish
    detail: Contracted views → two surfaces
---

## The problem

Public job postings are an attractive source of market information, but a chart can suggest more certainty than the source deserves. A keyword search is not a census. A regional sample is not a national total. And two countries collected under different rules are not automatically comparable.

The Observatory makes those distinctions part of the data product.

## What I built

The project collects public technology-job postings in two separate scopes: a Swedish keyword scope from JobTech and a German stratified regional panel from BA Jobsuche. Collection partitions are append-only, so a disappearing posting can be observed as an event rather than erased from history.

Structured fields are enriched against pinned reference data, then passed through an allowlisted privacy boundary. DuckDB and dbt support the analytical transformations and data contracts.

The same checked data feeds two surfaces: a charts-first React application, **Job Market Pulse**, and a self-contained analytical HTML page that remains readable without JavaScript.

## The interesting engineering decision

The dashboard is a **renderer, not an analyst**. It consumes a gated JSON export and does not invent additional figures in the frontend.

If a source has no structured occupation field, the UI shows that absence. It does not infer occupations from titles to make an empty chart look complete. Source scopes are never pooled into a misleading cross-country ranking.

This keeps the explanation next to the number instead of burying it in a separate methodology document.

## Evidence you can inspect

The repository includes the collection and publication scripts, pinned crosswalks, a synthetic sample, mapping evaluation, dbt contracts, dashboard screenshots, and the committed analytical artifact.

The documented offline quality gate includes linting, type checks, 63 Python tests, mapping evaluation, and 190 dbt resources. These are repository-documented checks; this portfolio does not present the historical posting counts as a live market feed.

## Scope and next steps

The Swedish source is keyword-scoped. The German scope uses a capped draw across a fixed regional panel. Different designs answer different questions, so the project explicitly avoids treating them as comparable national measurements.

A useful next step is the prepared usability study: can a reader correctly identify the source, denominator, and limitation of a chart? The protocol exists in the repository, but a completed study or measured usability outcome is not claimed.

*Case study based on the public repository snapshot from 6 September 2026. The exhibit on this site is a conceptual illustration, not current job-market data.*
